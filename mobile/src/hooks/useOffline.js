import { useEffect, useState } from "react";
import * as Network from "expo-network";

/** Indica si el dispositivo tiene conexión a internet en este momento. */
export function useOffline() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const state = await Network.getNetworkStateAsync();
        if (mounted) setIsOffline(!state.isConnected);
      } catch {
        if (mounted) setIsOffline(false);
      }
    }

    check();
    const interval = setInterval(check, 10000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return isOffline;
}
