import * as Notifications from "expo-notifications";
import { getNotificationPermissionState, requestNotificationPermissions } from "../src/services/notificationService";

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: { DEFAULT: 3 },
}));

jest.mock("react-native", () => ({ Platform: { OS: "ios" } }));

describe("notificationService", () => {
  it("distingue permiso bloqueado de una denegación recuperable", async () => {
    Notifications.getPermissionsAsync.mockResolvedValue({ granted: false, canAskAgain: false });
    await expect(getNotificationPermissionState()).resolves.toBe("blocked");
    await expect(requestNotificationPermissions()).resolves.toBe("blocked");
    expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  it("solicita permiso únicamente al invocarse y devuelve concedido", async () => {
    Notifications.getPermissionsAsync.mockResolvedValue({ granted: false, canAskAgain: true });
    Notifications.requestPermissionsAsync.mockResolvedValue({ status: "granted", canAskAgain: true });
    await expect(requestNotificationPermissions()).resolves.toBe("granted");
    expect(Notifications.requestPermissionsAsync).toHaveBeenCalledTimes(1);
  });
});
