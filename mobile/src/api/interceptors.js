import apiClient from "./client";
import { getSecure, deleteSecure } from "../utils/security";
import { STORAGE_KEYS } from "../utils/constants";

export function setupInterceptors(onUnauthorized) {
  apiClient.interceptors.request.use(async (config) => {
    const token = await getSecure(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await deleteSecure(STORAGE_KEYS.ACCESS_TOKEN);
        await deleteSecure(STORAGE_KEYS.REFRESH_TOKEN);
        if (onUnauthorized) onUnauthorized();
      }
      return Promise.reject(error);
    }
  );
}
