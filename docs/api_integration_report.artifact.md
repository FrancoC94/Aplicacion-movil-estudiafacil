# Informe de Integración API y Seguridad: EstudiaFácil

Este documento detalla la implementación técnica de la comunicación Cliente-Servidor, el manejo de sesiones y la validación de datos.

## 1. Configuración del Cliente (Axios)
Se utiliza una instancia centralizada de Axios configurada en `client.js` con las siguientes propiedades:
- **BaseURL:** `http://192.168.1.19:8000` (LAN IP para acceso desde dispositivo físico).
- **Timeout:** 10,000ms.
- **Headers:** `Content-Type: application/json` por defecto.

## 2. Lista de Interceptores y Orden de Ejecución

La aplicación implementa una cadena de interceptores para garantizar la transparencia en la autenticación:

1.  **Request Interceptor (Token Injection):**
    - Recupera el `access_token` de `SecureStore`.
    - Lo inyecta en el header `Authorization: Bearer <token>`.
2.  **Response Interceptor (Automatic Refresh):**
    - Si recibe un **401 (Unauthorized)**, pausa las peticiones entrantes, solicita un nuevo par de tokens al endpoint `/auth/refresh` y reintenta la petición original.
3.  **Error Interceptor (Validation Mapping):**
    - Si recibe un **422 (Unprocessable Entity)**, mapea el array `detail` de FastAPI a un objeto clave-valor para mostrar errores específicos en los campos del formulario.

## 3. Tabla de Correspondencia (Mapping) de Campos

| Módulo | Campo Cliente (UI) | Campo Servidor (API) | Validación |
| :--- | :--- | :--- | :--- |
| **Auth** | email | username | Requerido, formato email |
| **Materia** | nombre | nombre | Min 1, Max 100 caracteres |
| **Materia** | profesor | profesor | Opcional |
| **Tarea** | titulo | titulo | Min 1, Max 150 caracteres |
| **Tarea** | fecha | fecha_entrega | ISO8601 DateTime |

## 4. Verificación de Seguridad Realizada

- **Cifrado en Reposo:** Los tokens se almacenan en `SecureStore` (Keychain en iOS / Keystore en Android).
- **Vigencia de Tokens:**
    - **Access Token:** 1 minuto (Configurado así para forzar y verificar la renovación automática).
    - **Refresh Token:** 7 días.
- **Validación de Esquemas:** Uso de Pydantic en el backend para asegurar que ningún dato mal formado sea procesado por la lógica de negocio.
- **Protección CORS:** Solo se permiten orígenes conocidos definidos en el archivo `.env` del servidor.

---
**Fecha de Verificación:** 2026-09-10
**Estado:** Funcional y Verificado
