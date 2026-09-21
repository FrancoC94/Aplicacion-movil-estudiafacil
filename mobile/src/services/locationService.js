import * as Location from "expo-location";

export async function getLocationPermissionState() {
  const permission = await Location.getForegroundPermissionsAsync();
  if (permission.granted) return "granted";
  return permission.canAskAgain === false ? "blocked" : "denied";
}

// Solo se invoca desde la acción explícita del perfil, tras la explicación en pantalla.
export async function requestApproximateStudyLocation() {
  const existing = await Location.getForegroundPermissionsAsync();
  if (!existing.granted && existing.canAskAgain === false) return { state: "blocked" };
  const permission = existing.granted ? existing : await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) return { state: permission.canAskAgain === false ? "blocked" : "denied" };

  const enabled = await Location.hasServicesEnabledAsync();
  if (!enabled) return { state: "services_disabled" };

  try {
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    // Reduce precisión antes de persistir: ~1.1 km, suficiente para identificar una zona de estudio.
    const latitude = Number(position.coords.latitude.toFixed(2));
    const longitude = Number(position.coords.longitude.toFixed(2));
    return { state: "granted", location: { latitude, longitude, precision: "aproximada" } };
  } catch {
    return { state: "unavailable" };
  }
}
