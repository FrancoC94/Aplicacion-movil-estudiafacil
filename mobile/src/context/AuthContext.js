import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

import { AuthAPI, UserAPI } from "../api/endpoints";
import { setupInterceptors } from "../api/interceptors";
import { saveSecure, getSecure, deleteSecure } from "../utils/security";
import { STORAGE_KEYS } from "../utils/constants";
import { storageService } from "../services/storageService";
import { dbService } from "../services/dbService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    await deleteSecure(STORAGE_KEYS.ACCESS_TOKEN);
    await deleteSecure(STORAGE_KEYS.REFRESH_TOKEN);
    await storageService.clearAll();
    await dbService.clearAll();
    setUser(null);
  }, []);

  useEffect(() => {
    setupInterceptors(logout);
  }, [logout]);

  useEffect(() => {
    (async () => {
      try {
        await dbService.init();
        const token = await getSecure(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          try {
            const { data } = await UserAPI.getMe();
            setUser(data);
            await storageService.set("user_profile", data);
          } catch (apiError) {
            // Si es error de red o timeout, cargamos del caché local
            const cachedUser = await storageService.get("user_profile");
            if (cachedUser) {
              setUser(cachedUser);
            } else if (apiError.response?.status === 401) {
              await logout();
            }
          }
        }
      } catch (err) {
        console.error("Error al restaurar sesión:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [logout]);

  const login = async (email, password) => {
    const { data } = await AuthAPI.login(email, password);
    await saveSecure(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
    await saveSecure(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
    const me = await UserAPI.getMe();
    setUser(me.data);
    await storageService.set("user_profile", me.data);
  };

  const register = async (nombre, email, password) => {
    await AuthAPI.register({ nombre, email, password });
    await login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  return ctx;
}
