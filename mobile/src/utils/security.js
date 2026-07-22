import * as SecureStore from "expo-secure-store";

export async function saveSecure(key, value) {
  await SecureStore.setItemAsync(key, value);
}

export async function getSecure(key) {
  return SecureStore.getItemAsync(key);
}

export async function deleteSecure(key) {
  await SecureStore.deleteItemAsync(key);
}
