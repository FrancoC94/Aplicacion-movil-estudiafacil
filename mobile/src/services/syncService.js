import { TareasAPI, MateriasAPI } from "../api/endpoints";
import { dbService } from "./dbService";
import * as NetInfo from "@react-native-community/netinfo";

export const syncService = {
  async getTareas() {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected && state.isInternetReachable) {
        const { data } = await TareasAPI.list();
        await dbService.saveTareas(data);
        await dbService.setLastSync();
        return { data, isOffline: false, lastSync: new Date().toISOString() };
      }
      throw new Error("Offline");
    } catch (err) {
      const cached = await dbService.getTareas();
      const lastSync = await dbService.getLastSync();
      return { data: cached, isOffline: true, lastSync };
    }
  },

  async getMaterias() {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected && state.isInternetReachable) {
        const { data } = await MateriasAPI.list();
        await dbService.saveMaterias(data);
        return { data, isOffline: false };
      }
      throw new Error("Offline");
    } catch (err) {
      const cached = await dbService.getMaterias();
      return { data: cached, isOffline: true };
    }
  },

  async createTarea(tareaData) {
    try {
      const state = await NetInfo.fetch();
      if (state.isConnected && state.isInternetReachable) {
        const { data } = await TareasAPI.create(tareaData);
        return { data, synchronized: true };
      }
      throw new Error("Offline");
    } catch (err) {
      const tempId = `temp-${Date.now()}`;
      const nuevaTarea = {
        ...tareaData,
        id: tempId,
        estado: 'pendiente',
        prioridad: 'media',
        pendingSync: 1
      };

      await dbService.savePendingTarea(nuevaTarea);
      return { data: nuevaTarea, synchronized: false };
    }
  },

  async processOutbox() {
    const state = await NetInfo.fetch();
    if (!state.isConnected || !state.isInternetReachable) return;

    const pending = await dbService.getPendingTareas();
    if (pending.length === 0) return;

    console.log(`Sincronizando ${pending.length} tareas pendientes...`);

    for (const item of pending) {
      try {
        const { id, pendingSync, ...cleanData } = item;
        const { data } = await TareasAPI.create(cleanData);
        await dbService.markAsSynced(id, data.id);
      } catch (err) {
        console.error("Error sincronizando tarea individual:", err);
      }
    }
  },

  // Escuchador de red para auto-sincronización
  subscribeToNetwork(callback) {
    return NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        this.processOutbox().then(callback);
      }
    });
  }
};
