import { syncService } from "../src/services/syncService";
import { MateriasAPI } from "../src/api/endpoints";
import { dbService } from "../src/services/dbService";
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
}));

jest.mock("../src/services/dbService", () => ({
  dbService: {
    getMaterias: jest.fn().mockResolvedValue([]),
    saveMaterias: jest.fn().mockResolvedValue(true),
    getTareas: jest.fn().mockResolvedValue([]),
    saveTareas: jest.fn().mockResolvedValue(true),
    setLastSync: jest.fn().mockResolvedValue(true),
    getLastSync: jest.fn().mockResolvedValue(null),
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
});
