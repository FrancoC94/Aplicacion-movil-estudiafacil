import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

import { AuthAPI, UserAPI } from "../api/endpoints";
import { setupInterceptors } from "../api/interceptors";
import { saveSecure, getSecure, deleteSecure } from "../utils/security";
import { STORAGE_KEYS } from "../utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    await deleteSecure(STORAGE_KEYS.ACCESS_TOKEN);
    await deleteSecure(STORAGE_KEYS.REFRESH_TOKEN);
    setUser(null);
  }, []);

  useEffect(() => {
    setupInterceptors(logout);
  }, [logout]);

  useEffect(() => {
    (async () => {
      const token = await getSecure(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        try {
          const { data } = await UserAPI.getMe();
          setUser(data);
        } catch {
          await logout();
        }
      }
      setLoading(false);
    })();
  }, [logout]);

  const login = async (email, password) => {
    const { data } = await AuthAPI.login(email, password);
    await saveSecure(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
    await saveSecure(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
    const me = await UserAPI.getMe();
    setUser(me.data);
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
