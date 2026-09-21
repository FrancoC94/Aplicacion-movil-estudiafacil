# Informe Técnico - Taller Práctico Semana 14: Capacidades Nativas en EstudiaFácil

- **Proyecto:** EstudiaFácil Móvil & Backend
- **Ubicación local:** `E:\estudiafacil`
- **Repositorio:** [GitHub - FrancoC94/Aplicacion-movil-estudiafacil](https://github.com/FrancoC94/Aplicacion-movil-estudiafacil.git)
- **Fecha:** Septiembre 2026

---

## 1. Justificación de Capacidades Nativas y Nivel de Esencialidad

Se integraron dos capacidades nativas enfocadas en la experiencia de estudio del estudiante universitario:

| Capacidad | Justificación en EstudiaFácil | ¿Esencial u Opcional? |
| :--- | :--- | :--- |
| **1. Notificaciones Locales para Recordatorios** | Permite avisar al estudiante la proximidad de entrega de una tarea evaluativa incluso si la aplicación está cerrada, sin requerir infraestructura de notificaciones push de pago. | **Opcional / De conveniencia.** Si el usuario rechaza las notificaciones, el núcleo de la aplicación (creación, edición y listado de tareas) sigue funcionando al 100%. |
| **2. Ubicación en Primer Plano para Lugar de Estudio** | Permite registrar y recordar la zona habitual de estudio (biblioteca, campus universitario, hogar) para futuras sugerencias de concentración. | **Opcional.** La aplicación no depende de la ubicación para ninguna funcionalidad crítica; no se realiza ningún rastreo en segundo plano. |

---

## 2. Plugins Adoptados, Versiones y Criterios de Selección

| Plugin | Versión | Compatibilidad | Criterios de Selección |
| :--- | :--- | :--- | :--- |
| **`expo-notifications`** | `~0.32.17` | Expo SDK 54 / React Native 0.81 / Hermes | Módulo oficial del ecosistema Expo. Soporta programación de alertas locales en el dispositivo con precisión horaria, gestión del canal de notificación (`AndroidImportance.DEFAULT`) y total compatibilidad con la política de Android 13+ (`POST_NOTIFICATIONS`). |
| **`expo-location`** | `~19.0.8` | Expo SDK 54 / React Native 0.81 / Hermes | Módulo oficial y estándar. Permite solicitar permisos en primer plano (`Balanced` / `Coarse`), comprobar el estado de los servicios GPS (`hasServicesEnabledAsync`) y redondear coordenadas para preservar la privacidad del estudiante. |

---

## 3. Permisos Mínimos Declarados (Android & iOS)

Siguiendo el principio de mínimo privilegio, no se declaran permisos invasivos (se excluyen explícitamente `ACCESS_BACKGROUND_LOCATION`, lectura de galería o almacenamiento externo).

### Android (`mobile/app.json` y `mobile/android/app/src/main/AndroidManifest.xml`)
- `android.permission.INTERNET`: Comunicación con la API REST de FastAPI.
- `android.permission.POST_NOTIFICATIONS`: Obligatorio desde Android 13 (API 33) para mostrar recordatorios en la bandeja del sistema.
- `android.permission.ACCESS_COARSE_LOCATION`: Acceso a ubicación de celda/Wi-Fi (~1 km).
- `android.permission.ACCESS_FINE_LOCATION`: Acceso para resolver la posición al configurar el lugar de estudio.

### iOS (`mobile/app.json` - `ios.infoPlist`)
- `NSLocationWhenInUseUsageDescription`: *"EstudiaFácil usa tu ubicación aproximada solo cuando eliges guardar tu lugar de estudio."*
- `NSUserNotificationUsageDescription`: *"EstudiaFácil envía recordatorios locales de las tareas que decidas programar."*

---

## 4. Configuración de Android 16 / Target SDK 36

Para cumplir con la directiva de Google Play vigente desde agosto de 2026, el archivo de compilación nativa `mobile/android/app/build.gradle` fue fijado con:

```groovy
defaultConfig {
    applicationId 'com.estudiafacil.app'
    minSdkVersion rootProject.ext.minSdkVersion
    // Android 16 / API 36: requisito de distribución de Google Play desde agosto de 2026.
    targetSdkVersion 36
    versionCode 1
    versionName "1.0.0"
}
```

---

## 5. Matriz de Degradación y Gestión de Permisos al Momento de Uso

Los permisos se solicitan **única y exclusivamente tras una acción explícita del usuario** (al marcar el switch de recordatorio o presionar el botón "Configurar lugar de estudio"), previa pantalla/modal explicativa.

| Estado / Escenario | Comportamiento en Notificaciones | Comportamiento en Ubicación |
| :--- | :--- | :--- |
| **Pre-solicitud (Educativa)** | Modal de confirmación explica qué se usará antes de invocar la ventana nativa del sistema operativo. | Diálogo explica que solo se usará una vez de forma aproximada y sin segundo plano. |
| **Concedido (`granted`)** | Programa alerta local en el dispositivo, guarda el `notification_id` en SQLite local y sincroniza vía POST `/recordatorios`. | Obtiene posición, trunca coordenadas a 2 decimales (`toFixed(2)` ~1.1 km), guarda en `AsyncStorage` y sincroniza vía PUT `/users/me`. |
| **Denegado (`denied` / recuperable)** | La tarea se crea y guarda con éxito. Se informa al usuario mediante alerta que la tarea no tendrá recordatorio. | No se guarda ubicación. Se informa al usuario que puede configurarla más adelante. |
| **Bloqueado / Denegado Permanente (`blocked`)** | La tarea se crea normalmente. Se muestra diálogo con opción directa **"Abrir Ajustes"** (`Linking.openSettings()`). | No se guarda ubicación. Se presenta diálogo con botón para **"Abrir Ajustes"** del sistema. |
| **Servicio de Ubicación Apagado (`services_disabled`)** | N/A | Detectado con `Location.hasServicesEnabledAsync()`. Mensaje: *"Activa los servicios de ubicación del dispositivo y vuelve a intentarlo"*. |
| **Sin Conexión / Modo Avión (`offline`)** | Se programa la notificación local y se almacena en SQLite con `pendiente_backend = 1` para posterior sincronización. | Se almacena en almacenamiento local con clave `pending_study_location` y se sincroniza automáticamente al recuperar la red. |

---

## 6. Persistencia Local y Sincronización con el Backend

### Notificaciones de Tareas
1. **Local (SQLite - `dbService.js`):**
   ```sql
   CREATE TABLE IF NOT EXISTS recordatorios_locales (
     tarea_id TEXT PRIMARY KEY NOT NULL,
     notification_id TEXT,
     fecha_recordatorio TEXT NOT NULL,
     estado TEXT NOT NULL,
     pendiente_backend INTEGER DEFAULT 0
   );
   ```
2. **Backend (FastAPI & PostgreSQL/SQLite):**
   - Endpoint: `POST /recordatorios`
   - Esquema: `RecordatorioCreate(tarea_id, fecha_recordatorio)`
   - Relación vinculada al usuario autenticado.

### Lugar de Estudio del Usuario
1. **Local (`storageService.js` & `syncService.js`):**
   - Clave `study_location`: `{ latitude: -2.17, longitude: -79.92, precision: "aproximada" }`.
   - Clave `pending_study_location`: almacena el payload cuando el dispositivo no tiene red.
2. **Backend (Modelo `User`, Schemas Pydantic & Alembic):**
   - Campo `User.ubicacion_estudio`: columna `String(255)` agregada mediante migración Alembic `a8c4d91e2f07_agregar_ubicacion_estudio.py`.
   - Esquemas `UserBase`, `UserUpdate`, `UserOut` actualizados para aceptar y responder con `ubicacion_estudio`.
   - Endpoint: `PUT /users/me` y `GET /users/me`.

---

## 7. Casos de Prueba para Ejecutar y Grabar en Teléfono Físico

### Caso 1: Notificación Concedida y Recordatorio Programado
- **Acción:** Abrir pantalla Tareas -> Pulsar FAB (+) -> Llenar título, materia, fecha y activar switch "Recordatorio local". Pulsar "Guardar tarea". En el diálogo previo pulsar "Continuar" y en el diálogo del sistema pulsar "Permitir".
- **Resultado esperado:** Tarea creada en la lista; notificación local programada; registro guardado en SQLite y sincronizado con el backend.

### Caso 2: Denegación de Notificaciones (Degradación Elegante)
- **Acción:** Crear tarea con "Recordatorio local" activo. En el diálogo nativo pulsar "No permitir".
- **Resultado esperado:** Alerta *"Sin notificación: La tarea se creó correctamente sin recordatorio porque no concediste el permiso"*. La tarea aparece en la lista de tareas sin fallos ni bloqueos.

### Caso 3: Configurar Lugar de Estudio con Ubicación Concedida
- **Acción:** Ir a la pestaña **Perfil** -> Pulsar **"Configurar lugar de estudio"** -> En el diálogo explicativo pulsar "Continuar" -> Conceder permiso de ubicación al usar la app.
- **Resultado esperado:** Mensaje *"Lugar guardado: Tu zona de estudio aproximada se sincronizó con tu cuenta"*. En la tarjeta de perfil aparece la insignia: `📍 Zona de estudio configurada: Lat: X.XX, Lon: Y.YY (aproximada)`.

### Caso 4: Detección de GPS Desactivado y Denegación Permanente
- **Acción:** Desactivar la ubicación en la barra de ajustes rápidos de Android. En Perfil pulsar "Configurar lugar de estudio". Luego, denegar permanentemente el permiso ("No volver a preguntar").
- **Resultado esperado:** Si el GPS está apagado, alerta indicando encender el servicio. Si está denegado permanentemente, alerta con botón **"Abrir Ajustes"** que abre directamente la configuración del sistema de la app.

### Caso 5: Resiliencia Offline y Sincronización Automática
- **Acción:** Activar "Modo Avión" en el teléfono. Configurar lugar de estudio o crear tarea con recordatorio. Luego apagar el "Modo Avión" para restaurar Wi-Fi.
- **Resultado esperado:** La app notifica *"Guardado sin conexión"*; almacena el estado pendiente de forma local. En cuanto el listener de red detecta conectividad, el servicio `processOutbox` sincroniza automáticamente con FastAPI.

---

## 8. Guion Breve para el Video Demostrativo (3 Minutos)

- **0:00 - 0:35 | Introducción y Explicación de Permisos:**
  - Mostrar la app en el dispositivo físico, destacando que al abrir la app NO se solicita ningún permiso invasivo (respeto a la privacidad del usuario).
- **0:35 - 1:20 | Demostración de Notificaciones y Degradación:**
  - Crear una tarea con recordatorio. Mostrar diálogo previo explicativo.
  - Demostrar el flujo de concesión y luego una prueba denegando el permiso para evidenciar que la tarea se guarda sin errores.
- **1:20 - 2:05 | Demostración de Lugar de Estudio:**
  - Navegar al Perfil y tocar "Configurar lugar de estudio". Mostrar mensaje informativo.
  - Conceder permiso y mostrar el badge con las coordenadas aproximadas guardadas en pantalla.
- **2:05 - 2:35 | Demostración de GPS Apagado / Enlace a Ajustes:**
  - Apagar el GPS en la barra superior del teléfono y pulsar nuevamente para mostrar la detección de servicio desactivado y el botón para abrir ajustes del sistema.
- **2:35 - 3:00 | Demostración Offline y Cierre:**
  - Poner el teléfono en Modo Avión, guardar un cambio local y desactivar el Modo Avión para observar la sincronización automática con el backend FastAPI.

---

## 9. Limitaciones Reales y Estado del Entorno

> [!NOTE]
> **Evidencia y Transparencia del Entorno:**
> - Durante la sesión automatizada, todas las pruebas se validaron mediante la suite de pruebas unitarias (`pytest` para FastAPI y `jest` para React Native) y la compilación exitosa del bundle de producción Android en formato Hermes (`AppEntry-...hbc`, 1489 módulos sin errores).
> - La prueba en dispositivo físico final debe ser ejecutada y grabada por el estudiante utilizando Expo Go o una APK generada (`./gradlew assembleDebug` en `mobile/android`), siguiendo los pasos descritos en la sección 10 de este informe.

---

## 10. Pasos Exactos para Probar en Teléfono Físico

1. **Asegurar que el backend esté corriendo en la red local:**
   ```bash
   cd E:\estudiafacil\backend
   .venv\Scripts\activate
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
2. **Configurar la IP en el móvil:**
   - En `mobile/.env`, colocar la IP local de la computadora (ej. `EXPO_PUBLIC_API_URL=http://192.168.1.X:8000`).
3. **Iniciar Expo:**
   ```bash
   cd E:\estudiafacil\mobile
   npx expo start
   ```
4. **Abrir en el teléfono:**
   - Escanear el código QR con la app **Expo Go** (Android) o instalar la APK de desarrollo conectada por USB con `npx expo run:android`.
   - Ejecutar los 5 casos de prueba detallados en la Sección 7.
