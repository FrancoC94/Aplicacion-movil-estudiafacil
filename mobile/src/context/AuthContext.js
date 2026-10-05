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
        try {
          await dbService.init();
        } catch (dbErr) {
          console.warn("SQLite init failed, running without local cache:", dbErr);
        }
        const token = await getSecure(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          // Restauración instantánea desde caché local para evitar esperas en SplashScreen
          const cachedUser = await storageService.get("user_profile");
          if (cachedUser) {
            setUser(cachedUser);
          }

          // Revalidación en segundo plano con el backend
          try {
            const { data } = await UserAPI.getMe();
            setUser(data);
            await storageService.set("user_profile", data);
          } catch (apiError) {
            if (apiError.response?.status === 401) {
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

  const loginOffline = async (email = "javif442@gmail.com", nombre = "Cristian") => {
    const offlineProfile = {
      id: 1,
      nombre: nombre || "Cristian",
      email: email || "javif442@gmail.com",
      carrera: "Tecnologías de la Información",
      universidad: "Universidad Estatal Amazónica",
      semestre_ciclo: "Sexto Ciclo",
      rol: "estudiante",
      is_active: true,
      is_verified: true,
      ubicacion_estudio: JSON.stringify({ latitude: -0.08, longitude: -78.51, precision: "aproximada" }),
      is_offline_session: true,
    };

    try {
      await dbService.init();
      // Precargar materias reales de la base de datos si SQLite local está vacío
      const existingMaterias = await dbService.getMaterias();
      if (!existingMaterias || existingMaterias.length === 0) {
        await dbService.saveMaterias([
          { id: 1, nombre: "Aplicaciones móviles", color: "#3F51B5", usuario_id: 1 },
          { id: 2, nombre: "Matemáticas", color: "#009688", usuario_id: 1 },
          { id: 3, nombre: "Ciencias de datos", color: "#FF9800", usuario_id: 1 }
        ]);
      }

      // Precargar tareas si SQLite local está vacío
      const existingTareas = await dbService.getTareas();
      if (!existingTareas || existingTareas.length === 0) {
        await dbService.saveTareas([
          {
            id: "1",
            titulo: "Foro semana 14",
            descripcion: "Capacidades nativas y pruebas",
            fecha_entrega: new Date(Date.now() + 86400000 * 2).toISOString(),
            estado: "pendiente",
            prioridad: "alta",
            materia_id: 1
          },
          {
            id: "2",
            titulo: "Ensayo Práctico",
            descripcion: "Informe final semana 16",
            fecha_entrega: new Date(Date.now() + 86400000 * 4).toISOString(),
            estado: "en_progreso",
            prioridad: "media",
            materia_id: 2
          }
        ]);
      }
    } catch (e) {
      console.warn("Error inicializando datos offline en SQLite:", e);
    }

    await saveSecure(STORAGE_KEYS.ACCESS_TOKEN, "offline_access_token_uea");
    await storageService.set("user_profile", offlineProfile);
    setUser(offlineProfile);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginOffline, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  return ctx;
}
