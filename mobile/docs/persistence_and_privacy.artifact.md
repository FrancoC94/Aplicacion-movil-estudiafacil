# Estrategia de Persistencia y Privacidad de Datos - EstudiaFácil

Este documento detalla cómo la aplicación gestiona la persistencia de datos, la sincronización offline y el cumplimiento de la privacidad del usuario.

## 1. Clasificación de Datos

| Tipo de Dato | Origen | Almacenamiento Local | Almacenamiento Remoto | Nivel de Sensibilidad |
| :--- | :--- | :--- | :--- | :--- |
| **Credenciales (JWT)** | Autenticación | `Expo SecureStore` (Cifrado) | Base de Datos (Backend) | **Crítico** |
| **Datos de Usuario** | Perfil | `AsyncStorage` | Base de Datos (Backend) | **Alto** (Privado) |
| **Académicos (Tareas/Materias)** | Usuario | `AsyncStorage` (Caché) | Base de Datos (Backend) | **Medio** |
| **Configuración (Temas)** | Usuario | `AsyncStorage` | N/A | **Bajo** |

## 2. Justificación del Mecanismo de Persistencia

Se ha implementado una arquitectura **Offline-First** utilizando una combinación de:
- **Expo SecureStore:** Para tokens de sesión, garantizando que los secretos no sean legibles por otras apps en el dispositivo.
- **AsyncStorage:** Para la caché de datos académicos y el "Outbox" de sincronización, priorizando la disponibilidad de la información sin conexión.
- **Service-Based Sync:** Un servicio centralizado (`syncService`) que actúa como mediador entre la UI y la API, gestionando automáticamente el flujo de datos según la conectividad.

## 3. Estrategia de Conflictos y Limitaciones

### Estrategia: "Last Write Wins" (El último en escribir gana)
Debido a que EstudiaFácil es una aplicación de uso personal y no colaborativa, se ha optado por la simplicidad:
1. Las operaciones offline se encolan cronológicamente.
2. Al recuperar la conexión, se envían al servidor en el mismo orden.
3. El servidor actualiza el registro más reciente.

### Limitación Declarada
Si el usuario utiliza la aplicación en dos dispositivos diferentes simultáneamente y realiza cambios contradictorios en la misma tarea mientras ambos están offline, al sincronizarse, el dispositivo que recupere la conexión al final sobrescribirá los cambios del primero.

## 4. Registro de Datos Personales y Retención

| Dato Personal | Propósito | Tiempo de Retención |
| :--- | :--- | :--- |
| **Nombre** | Personalización de la interfaz. | Mientras la cuenta esté activa. |
| **Correo Electrónico** | Identificación única y recuperación de cuenta. | Mientras la cuenta esté activa. |
| **Tareas Académicas** | Organización y recordatorios. | Hasta que el usuario las elimine. |

**Limpieza de Datos:** Al cerrar sesión, la aplicación ejecuta un comando de limpieza total (`AsyncStorage.clear()`), eliminando cualquier rastro de datos personales y caché académica del dispositivo físico.
