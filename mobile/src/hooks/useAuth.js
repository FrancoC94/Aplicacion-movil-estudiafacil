import { useAuthContext } from "../context/AuthContext";

/** Hook de conveniencia para acceder al estado y acciones de autenticación. */
export function useAuth() {
  return useAuthContext();
}
