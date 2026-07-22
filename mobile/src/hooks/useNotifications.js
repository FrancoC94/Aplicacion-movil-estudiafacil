import { useNotificationContext } from "../context/NotificationContext";

/** Hook de conveniencia para acceder a las notificaciones del usuario. */
export function useNotifications() {
  return useNotificationContext();
}
