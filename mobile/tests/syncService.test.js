import { syncService } from "../src/services/syncService";
import { MateriasAPI, TareasAPI, RecordatoriosAPI, UserAPI } from "../src/api/endpoints";
import { dbService } from "../src/services/dbService";
import { storageService } from "../src/services/storageService";
import * as Network from "expo-network";

jest.mock("../src/api/endpoints", () => ({
  MateriasAPI: {
    create: jest.fn(),
    list: jest.fn(),
  },
  TareasAPI: {
    create: jest.fn(),
    list: jest.fn(),
  },
  RecordatoriosAPI: {
    create: jest.fn(),
  },
  UserAPI: {
    updateMe: jest.fn(),
  },
}));

jest.mock("../src/services/dbService", () => ({
  dbService: {
    getMaterias: jest.fn().mockResolvedValue([]),
    saveMaterias: jest.fn().mockResolvedValue(true),
    getTareas: jest.fn().mockResolvedValue([]),
    saveTareas: jest.fn().mockResolvedValue(true),
    setLastSync: jest.fn().mockResolvedValue(true),
    getLastSync: jest.fn().mockResolvedValue(null),
    saveReminder: jest.fn().mockResolvedValue(true),
    markReminderSynced: jest.fn().mockResolvedValue(true),
    getPendingReminders: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock("../src/services/storageService", () => ({
  storageService: {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
  },
}));

jest.mock("expo-network", () => ({
  getNetworkStateAsync: jest.fn(),
}));

describe("syncService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createMateria online envía a la API y persiste localmente", async () => {
    Network.getNetworkStateAsync.mockResolvedValue({ isConnected: true, isInternetReachable: true });
    MateriasAPI.create.mockResolvedValue({ data: { id: 1, nombre: "Física", profesor: "Dr. Smith" } });

    const result = await syncService.createMateria({ nombre: "Física", profesor: "Dr. Smith" });

    expect(result.synchronized).toBe(true);
    expect(result.data.id).toBe(1);
    expect(MateriasAPI.create).toHaveBeenCalledWith({ nombre: "Física", profesor: "Dr. Smith" });
    expect(dbService.saveMaterias).toHaveBeenCalled();
  });

  it("createMateria offline guarda localmente", async () => {
    Network.getNetworkStateAsync.mockResolvedValue({ isConnected: false, isInternetReachable: false });

    const result = await syncService.createMateria({ nombre: "Química" });

    expect(result.synchronized).toBe(false);
    expect(result.data.nombre).toBe("Química");
    expect(MateriasAPI.create).not.toHaveBeenCalled();
    expect(dbService.saveMaterias).toHaveBeenCalled();
  });

  it("saveReminder online persiste en SQLite y envía a RecordatoriosAPI", async () => {
    Network.getNetworkStateAsync.mockResolvedValue({ isConnected: true, isInternetReachable: true });
    RecordatoriosAPI.create.mockResolvedValue({ data: { id: 10 } });

    const result = await syncService.saveReminder(5, "notif-123", "2026-09-25T10:00:00.000Z");

    expect(result.synchronized).toBe(true);
    expect(dbService.saveReminder).toHaveBeenCalledWith({
      tareaId: 5,
      notificationId: "notif-123",
      fechaRecordatorio: "2026-09-25T10:00:00.000Z",
      estado: "local",
      pendingBackend: true,
    });
    expect(RecordatoriosAPI.create).toHaveBeenCalledWith({
      tarea_id: 5,
      fecha_recordatorio: "2026-09-25T10:00:00.000Z",
    });
    expect(dbService.markReminderSynced).toHaveBeenCalledWith(5);
  });

  it("saveReminder offline persiste en SQLite con estado pendiente", async () => {
    Network.getNetworkStateAsync.mockResolvedValue({ isConnected: false, isInternetReachable: false });

    const result = await syncService.saveReminder(6, "notif-456", "2026-09-25T10:00:00.000Z");

    expect(result.synchronized).toBe(false);
    expect(dbService.saveReminder).toHaveBeenCalled();
    expect(RecordatoriosAPI.create).not.toHaveBeenCalled();
    expect(dbService.markReminderSynced).not.toHaveBeenCalled();
  });

  it("saveStudyLocation online persiste localmente y sincroniza con UserAPI", async () => {
    Network.getNetworkStateAsync.mockResolvedValue({ isConnected: true, isInternetReachable: true });
    const location = { latitude: -2.17, longitude: -79.92, precision: "aproximada" };
    UserAPI.updateMe.mockResolvedValue({ data: { id: 1, ubicacion_estudio: JSON.stringify(location) } });

    const result = await syncService.saveStudyLocation(location);

    expect(result.synchronized).toBe(true);
    expect(storageService.set).toHaveBeenCalledWith("study_location", location);
    expect(UserAPI.updateMe).toHaveBeenCalledWith({ ubicacion_estudio: JSON.stringify(location) });
    expect(storageService.remove).toHaveBeenCalledWith("pending_study_location");
  });

  it("saveStudyLocation offline guarda localmente y marca pendiente para sincronizar", async () => {
    Network.getNetworkStateAsync.mockResolvedValue({ isConnected: false, isInternetReachable: false });
    const location = { latitude: -2.17, longitude: -79.92, precision: "aproximada" };

    const result = await syncService.saveStudyLocation(location);

    expect(result.synchronized).toBe(false);
    expect(storageService.set).toHaveBeenCalledWith("study_location", location);
    expect(storageService.set).toHaveBeenCalledWith("pending_study_location", location);
    expect(UserAPI.updateMe).not.toHaveBeenCalled();
  });

  it("syncPendingStudyLocation sincroniza el cambio pendiente cuando vuelve la red", async () => {
    Network.getNetworkStateAsync.mockResolvedValue({ isConnected: true, isInternetReachable: true });
    const pendingLocation = { latitude: -2.17, longitude: -79.92, precision: "aproximada" };
    storageService.get.mockResolvedValue(pendingLocation);
    UserAPI.updateMe.mockResolvedValue({ data: { id: 1, ubicacion_estudio: JSON.stringify(pendingLocation) } });

    const synced = await syncService.syncPendingStudyLocation();

    expect(synced).toBe(true);
    expect(UserAPI.updateMe).toHaveBeenCalledWith({ ubicacion_estudio: JSON.stringify(pendingLocation) });
    expect(storageService.remove).toHaveBeenCalledWith("pending_study_location");
  });
});
