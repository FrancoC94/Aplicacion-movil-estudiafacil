import * as Location from "expo-location";
import {
  getLocationPermissionState,
  requestApproximateStudyLocation,
} from "../src/services/locationService";

jest.mock("expo-location", () => ({
  getForegroundPermissionsAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
  hasServicesEnabledAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
}));

describe("locationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getLocationPermissionState", () => {
    it("devuelve 'granted' si el permiso ya fue concedido", async () => {
      Location.getForegroundPermissionsAsync.mockResolvedValue({
        granted: true,
        canAskAgain: true,
      });

      const state = await getLocationPermissionState();
      expect(state).toBe("granted");
    });

    it("devuelve 'blocked' si fue denegado de forma permanente (canAskAgain: false)", async () => {
      Location.getForegroundPermissionsAsync.mockResolvedValue({
        granted: false,
        canAskAgain: false,
      });

      const state = await getLocationPermissionState();
      expect(state).toBe("blocked");
    });

    it("devuelve 'denied' si fue denegado pero aún puede preguntarse de nuevo", async () => {
      Location.getForegroundPermissionsAsync.mockResolvedValue({
        granted: false,
        canAskAgain: true,
      });

      const state = await getLocationPermissionState();
      expect(state).toBe("denied");
    });
  });

  describe("requestApproximateStudyLocation", () => {
    it("no solicita el permiso al sistema si ya está bloqueado permanentemente", async () => {
      Location.getForegroundPermissionsAsync.mockResolvedValue({
        granted: false,
        canAskAgain: false,
      });

      const result = await requestApproximateStudyLocation();
      expect(result).toEqual({ state: "blocked" });
      expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
    });

    it("solicita permiso y devuelve 'denied' cuando el usuario rechaza temporalmente", async () => {
      Location.getForegroundPermissionsAsync.mockResolvedValue({
        granted: false,
        canAskAgain: true,
      });
      Location.requestForegroundPermissionsAsync.mockResolvedValue({
        granted: false,
        canAskAgain: true,
      });

      const result = await requestApproximateStudyLocation();
      expect(result).toEqual({ state: "denied" });
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalledTimes(1);
    });

    it("solicita permiso y devuelve 'blocked' cuando el usuario rechaza permanentemente", async () => {
      Location.getForegroundPermissionsAsync.mockResolvedValue({
        granted: false,
        canAskAgain: true,
      });
      Location.requestForegroundPermissionsAsync.mockResolvedValue({
        granted: false,
        canAskAgain: false,
      });

      const result = await requestApproximateStudyLocation();
      expect(result).toEqual({ state: "blocked" });
    });

    it("distingue cuando el permiso fue concedido pero el GPS/servicio está apagado", async () => {
      Location.getForegroundPermissionsAsync.mockResolvedValue({
        granted: true,
        canAskAgain: true,
      });
      Location.hasServicesEnabledAsync.mockResolvedValue(false);

      const result = await requestApproximateStudyLocation();
      expect(result).toEqual({ state: "services_disabled" });
      expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
    });

    it("obtiene la posición y redondea a dos decimales para mantener privacidad aproximada", async () => {
      Location.getForegroundPermissionsAsync.mockResolvedValue({
        granted: true,
        canAskAgain: true,
      });
      Location.hasServicesEnabledAsync.mockResolvedValue(true);
      Location.getCurrentPositionAsync.mockResolvedValue({
        coords: {
          latitude: -2.1748291,
          longitude: -79.9234192,
        },
      });

      const result = await requestApproximateStudyLocation();
      expect(result).toEqual({
        state: "granted",
        location: {
          latitude: -2.17,
          longitude: -79.92,
          precision: "aproximada",
        },
      });
    });

    it("devuelve 'unavailable' si la obtención del GPS falla o lanza excepción", async () => {
      Location.getForegroundPermissionsAsync.mockResolvedValue({
        granted: true,
        canAskAgain: true,
      });
      Location.hasServicesEnabledAsync.mockResolvedValue(true);
      Location.getCurrentPositionAsync.mockRejectedValue(new Error("Timeout GPS"));

      const result = await requestApproximateStudyLocation();
      expect(result).toEqual({ state: "unavailable" });
    });
  });
});
