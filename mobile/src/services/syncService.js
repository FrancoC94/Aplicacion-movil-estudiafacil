import { TareasAPI, MateriasAPI } from "../api/endpoints";
import { dbService } from "./dbService";
import * as Network from "expo-network";

export const syncService = {
  async isOnline() {
    try {
      const state = await Network.getNetworkStateAsync();
      return Boolean(state.isConnected && state.isInternetReachable !== false);
    } catch {
      return false;
    }
  },

  async getTareas() {
    try {
      const online = await this.isOnline();
      if (online) {
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
      const online = await this.isOnline();
      if (online) {
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

  async createMateria(materiaData) {
    try {
      const online = await this.isOnline();
      if (online) {
        const { data } = await MateriasAPI.create(materiaData);
        const materias = await dbService.getMaterias();
        await dbService.saveMaterias([...materias, data]);
        return { data, synchronized: true };
      }
      throw new Error("Offline");
    } catch (err) {
      const tempId = Date.now();
      const nuevaMateria = {
        ...materiaData,
        id: tempId,
        color: materiaData.color || "#4A90D9",
        usuario_id: 0,
      };
      const materias = await dbService.getMaterias();
      await dbService.saveMaterias([...materias, nuevaMateria]);
      return { data: nuevaMateria, synchronized: false };
    }
  },

  async createTarea(tareaData) {
    try {
      const online = await this.isOnline();
      if (online) {
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
    const online = await this.isOnline();
    if (!online) return;

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
    let active = true;
    const interval = setInterval(async () => {
      try {
        const online = await this.isOnline();
        if (active && online) {
          await this.processOutbox();
          if (callback) callback();
        }
      } catch {
        // Silencioso
      }
    }, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }
};

