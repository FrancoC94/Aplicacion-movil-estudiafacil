import * as SQLite from 'expo-sqlite';

let _db = null;

function getDb() {
  if (!_db) {
    _db = SQLite.openDatabaseSync('estudiafacil.db');
  }
  return _db;
}

export const dbService = {
  async init() {
    const db = getDb();
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS materias (
        id INTEGER PRIMARY KEY NOT NULL,
        nombre TEXT NOT NULL,
        color TEXT,
        usuario_id INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS tareas (
        id TEXT PRIMARY KEY NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        fecha_entrega TEXT NOT NULL,
        estado TEXT NOT NULL,
        prioridad TEXT NOT NULL,
        materia_id INTEGER NOT NULL,
        pendingSync INTEGER DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT
      );
      CREATE TABLE IF NOT EXISTS recordatorios_locales (
        tarea_id TEXT PRIMARY KEY NOT NULL,
        notification_id TEXT,
        fecha_recordatorio TEXT NOT NULL,
        estado TEXT NOT NULL,
        pendiente_backend INTEGER DEFAULT 0
      );
    `);
  },

  async clearAll() {
    const db = getDb();
    await db.execAsync(`
      DELETE FROM materias;
      DELETE FROM tareas;
      DELETE FROM meta;
      DELETE FROM recordatorios_locales;
    `);
  },

  // Materias
  async saveMaterias(materias) {
    const db = getDb();
    for (const m of materias) {
      await db.runAsync(
        'INSERT OR REPLACE INTO materias (id, nombre, color, usuario_id) VALUES (?, ?, ?, ?)',
        [m.id, m.nombre, m.color, m.usuario_id]
      );
    }
  },

  async getMaterias() {
    const db = getDb();
    return await db.getAllAsync('SELECT * FROM materias');
  },

  // Tareas
  async saveTareas(tareas) {
    const db = getDb();
    // Primero limpiamos las que no están pendientes de sincronizar para evitar basura
    await db.runAsync('DELETE FROM tareas WHERE pendingSync = 0');
    for (const t of tareas) {
      await db.runAsync(
        'INSERT OR REPLACE INTO tareas (id, titulo, descripcion, fecha_entrega, estado, prioridad, materia_id, pendingSync) VALUES (?, ?, ?, ?, ?, ?, ?, 0)',
        [t.id, t.titulo, t.descripcion, t.fecha_entrega, t.estado, t.prioridad, t.materia_id]
      );
    }
  },

  async savePendingTarea(tarea) {
    const db = getDb();
    await db.runAsync(
      'INSERT INTO tareas (id, titulo, descripcion, fecha_entrega, estado, prioridad, materia_id, pendingSync) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
      [tarea.id, tarea.titulo, tarea.descripcion, tarea.fecha_entrega, tarea.estado, tarea.prioridad, tarea.materia_id]
    );
  },

  async getTareas() {
    const db = getDb();
    return await db.getAllAsync('SELECT * FROM tareas ORDER BY fecha_entrega ASC');
  },

  async getPendingTareas() {
    const db = getDb();
    return await db.getAllAsync('SELECT * FROM tareas WHERE pendingSync = 1');
  },

  async markAsSynced(tempId, serverId) {
    const db = getDb();
    await db.runAsync('UPDATE tareas SET id = ?, pendingSync = 0 WHERE id = ?', [serverId, tempId]);
    await db.runAsync('UPDATE recordatorios_locales SET tarea_id = ? WHERE tarea_id = ?', [String(serverId), String(tempId)]);
  },

  async saveReminder(reminder) {
    const db = getDb();
    await db.runAsync(
      'INSERT OR REPLACE INTO recordatorios_locales (tarea_id, notification_id, fecha_recordatorio, estado, pendiente_backend) VALUES (?, ?, ?, ?, ?)',
      [String(reminder.tareaId), reminder.notificationId || null, reminder.fechaRecordatorio, reminder.estado, reminder.pendingBackend ? 1 : 0]
    );
  },

  async getPendingReminders() {
    const db = getDb();
    return db.getAllAsync('SELECT * FROM recordatorios_locales WHERE pendiente_backend = 1');
  },

  async markReminderSynced(tareaId) {
    const db = getDb();
    await db.runAsync('UPDATE recordatorios_locales SET pendiente_backend = 0, estado = ? WHERE tarea_id = ?', ['sincronizado', String(tareaId)]);
  },

  // Meta (Sync stats)
  async setLastSync() {
    const db = getDb();
    const now = new Date().toISOString();
    await db.runAsync('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)', ['lastSync', now]);
  },

  async getLastSync() {
    const db = getDb();
    const res = await db.getFirstAsync('SELECT value FROM meta WHERE key = ?', ['lastSync']);
    return res ? res.value : null;
  }
};
