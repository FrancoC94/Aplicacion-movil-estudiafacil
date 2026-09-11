# Documentación Técnica: Arquitectura Offline-First EstudiaFácil

Este documento describe la estrategia de persistencia, sincronización y manejo de datos personales de la aplicación EstudiaFácil.

## 1. Tabla de Clasificación de Datos

| Dato | Categoría | Almacenamiento | Justificación |
| :--- | :--- | :--- | :--- |
| **Token de Acceso** | Sensible | SecureStore | Requerido para autenticar cada petición; debe estar cifrado. |
| **Perfil (Nombre/Email)** | Personal | Local (Caché) / Servidor | Muestra la identidad del usuario en la UI de forma rápida. |
| **Materias** | No Personal | SQLite / Servidor | Estructura organizativa del usuario. |
| **Tareas** | No Personal | SQLite / Servidor | Contenido académico generado por el usuario. |
| **Estado de Sync** | Técnico | SQLite (Meta) | Controla el indicador de datos desactualizados. |

## 2. Justificación del Mecanismo de Almacenamiento

Se ha seleccionado **`expo-sqlite`** como motor principal de almacenamiento local por las siguientes razones:
- **Estructura Relacional**: Las materias y tareas tienen una relación de 1:N que es costosa de manejar y filtrar en `AsyncStorage` (clave-valor).
- **Volumen de Datos**: A medida que el historial académico crece, SQLite permite realizar consultas indexadas eficientes (ej. filtrar por fecha o prioridad) sin cargar todos los registros en memoria.
- **Atomicidad**: Garantiza que las operaciones en la cola de sincronización (`pendingSync`) sean consistentes mediante transacciones SQL.

## 3. Estrategia de Resolución de Conflictos

La aplicación implementa una estrategia de **"Última Escritura Gana" (Last-Write-Wins)** simplificada:
- **Mecanismo**: Cuando un dispositivo recupera conexión, envía su cola local al servidor. El servidor procesa la creación y devuelve el ID definitivo.
- **Limitación Conocida**: Si el usuario edita una tarea desde dos dispositivos diferentes mientras ambos están offline, el cambio que se sincronice en segundo lugar sobrescribirá al primero en el servidor. No se implementa actualmente detección de versiones (diffing) por ser una aplicación de uso individual.

## 4. Registro de Datos Personales Almacenados

| Dato Personal | Ubicación | Retención | Momento de Eliminación |
| :--- | :--- | :--- | :--- |
| Token de Sesión | SecureStore | Permanente | Al cerrar sesión o tras 7 días de inactividad (expiración). |
| Nombre y Email | AsyncStorage (caché) | Permanente | Al cerrar sesión (`storageService.clearAll`). |
| Contenido Académico | SQLite | Permanente | Al cerrar sesión (`dbService.clearAll`). |

---
**Repositorio:** [ENLACE AL REPOSITORIO]
