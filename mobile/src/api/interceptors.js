import apiClient from "./client";
import { getSecure, saveSecure, deleteSecure } from "../utils/security";
import { STORAGE_KEYS } from "../utils/constants";
import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export function setupInterceptors(onUnauthorized) {
  // 1. Interceptor de Petición: Añade el token
  apiClient.interceptors.request.use(async (config) => {
    const token = await getSecure(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 2. Interceptor de Respuesta: Maneja expiración y errores
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Si es 401 y no hemos intentado reintentar aún
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await getSecure(STORAGE_KEYS.REFRESH_TOKEN);
          if (!refreshToken) throw new Error("No refresh token");

          // Usamos una instancia limpia de axios para no entrar en bucle
          const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          await saveSecure(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
          await saveSecure(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);

          apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

          processQueue(null, data.access_token);
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          await deleteSecure(STORAGE_KEYS.ACCESS_TOKEN);
          await deleteSecure(STORAGE_KEYS.REFRESH_TOKEN);
          if (onUnauthorized) onUnauthorized();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Manejo de errores de validación 422 (FastAPI)
      if (error.response?.status === 422) {
        // Transformamos el error para que sea más fácil de usar en el cliente
        error.validationErrors = error.response.data.detail.reduce((acc, curr) => {
            const field = curr.loc[curr.loc.length - 1];
            acc[field] = curr.msg;
            return acc;
        }, {});
      }

      return Promise.reject(error);
    }
  );
}
