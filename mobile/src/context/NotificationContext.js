import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

import { NotificacionesAPI } from "../api/endpoints";
import { useAuthContext } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuthContext();
  const [notificaciones, setNotificaciones] = useState([]);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await NotificacionesAPI.list();
      setNotificaciones(data);
    } catch {
      // Silencioso: la app sigue funcionando aunque falle la carga de notificaciones
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const marcarLeida = async (id) => {
    await NotificacionesAPI.marcarLeida(id);
    setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <NotificationContext.Provider value={{ notificaciones, noLeidas, refresh, marcarLeida }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotificationContext debe usarse dentro de NotificationProvider");
  return ctx;
}
