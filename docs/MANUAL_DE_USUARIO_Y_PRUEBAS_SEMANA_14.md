# 📘 UNIVERSIDAD ESTATAL AMAZÓNICA (UEA)
## FACULTAD DE CIENCIAS DE LA TIERRA Y DE LA COMPUTACIÓN
### ASIGNATURA: Desarrollo de Aplicaciones Móviles / Proyecto Integrador
**Semana 14:** Incorporación de Funcionalidades Nativas al Prototipo  
**Proyecto:** EstudiaFácil Móvil  
**Repositorio GitHub:** [https://github.com/FrancoC94/Aplicacion-movil-estudiafacil.git](https://github.com/FrancoC94/Aplicacion-movil-estudiafacil.git)  

---

# 📖 MANUAL DE USUARIO Y GUÍA DE DEMOSTRACIÓN (SEMANA 14)

---

## ÍNDICE
1. [Objetivo del Manual](#1-objetivo-del-manual)
2. [Arquitectura de Capacidades Nativas](#2-arquitectura-de-capacidades-nativas)
3. [Manual de Usuario - Paso a Paso](#3-manual-de-usuario---paso-a-paso)
   - [3.1. Acceso a la Aplicación (Sin permisos intrusivos)](#31-acceso-a-la-aplicación-sin-permisos-intrusivos)
   - [3.2. Creación de Tarea con Recordatorio Nativo](#32-creación-de-tarea-con-recordatorio-nativo)
   - [3.3. Configuración del Lugar de Estudio (Ubicación Aproximada)](#33-configuración-del-lugar-de-estudio-ubicación-aproximada)
4. [Matriz de Comportamiento y Degradación Elegante](#4-matriz-de-comportamiento-y-degradación-elegante)
5. [Cumplimiento Técnico y Plataformas (Android 16 & iOS)](#5-cumplimiento-técnico-y-plataformas-android-16--ios)
6. [Guía de Ejecución de Pruebas en Dispositivo Físico](#6-guía-de-ejecución-de-pruebas-en-dispositivo-físico)
7. [Guion Exacto para la Grabación del Video (10/10)](#7-guion-exacto-para-la-grabación-del-video-1010)

---

## 1. Objetivo del Manual
Este manual orienta al usuario y al evaluador en el uso y verificación de las **funcionalidades nativas** integradas en la aplicación móvil **EstudiaFácil**. Demuestra el cumplimiento de las buenas prácticas de desarrollo móvil:
- Solicitud de permisos en el momento de uso (*Just-in-Time*).
- Explicación previa mediante interfaces contextuales.
- Degradación elegante ante denegación temporal o permanente.
- Redondeo y preservación de la privacidad del estudiante.
- Sincronización híbrida (Persistencia local SQLite + Sincronización en la nube con FastAPI).

---

## 2. Arquitectura de Capacidades Nativas

```
                         ┌─────────────────────────────┐
                         │   EstudiaFácil (Mobile)     │
                         └──────────────┬──────────────┘
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             ▼                                                     ▼
┌─────────────────────────┐                               ┌─────────────────────────┐
│  expo-notifications     │                               │      expo-location      │
├─────────────────────────┤                               ├─────────────────────────┤
│ • Solicitud en Tareas   │                               │ • Solicitud en Perfil   │
│ • Canal Android DEFAULT │                               │ • Precisión Balanced    │
│ • Alerta programada     │                               │ • Truncado a 2 decimales│
└────────────┬────────────┘                               └────────────┬────────────┘
             │                                                         │
             ▼                                                         ▼
┌─────────────────────────┐                               ┌─────────────────────────┐
│  SQLite Local (Offline) │                               │ AsyncStorage (Offline)  │
│  recordatorios_locales  │                               │  pending_study_location │
└────────────┬────────────┘                               └────────────┬────────────┘
             │                                                         │
             └──────────────────────────┬──────────────────────────────┘
                                        ▼ (Al recuperar red)
                         ┌─────────────────────────────┐
                         │      Backend (FastAPI)      │
                         │ • POST /recordatorios       │
                         │ • PUT /users/me             │
                         └─────────────────────────────┘
```

---

## 3. Manual de Usuario - Paso a Paso

### 3.1. Acceso a la Aplicación (Sin permisos intrusivos)
1. Abra la aplicación **EstudiaFácil**.
2. **Observación clave:** La aplicación **no solicita ningún permiso** en la pantalla de bienvenida, login o inicio. Cumple con la normativa de tiendas de no molestar al usuario antes de interactuar con una funcionalidad que realmente requiera el dispositivo.

### 3.2. Creación de Tarea con Recordatorio Nativo
1. Diríjase a la pestaña **Tareas**.
2. Toque el botón flotante **(+)** para abrir el formulario de creación.
3. Ingrese el **Título** (ej. *"Ensayo de Gestión Ambiental"*), seleccione la **Materia**, ingrese la **Descripción** y la **Fecha de entrega**.
4. Active el interruptor (switch) **"Recordatorio local"**.
5. Presione **"Guardar tarea"**.
6. **Flujo de permiso en el momento de uso:**
   - Aparece un diálogo educativo previo:  
     > *"Usaremos notificaciones locales únicamente para avisarte de esta tarea en tu dispositivo. Puedes continuar sin activar notificaciones."*
   - Si presiona **"Continuar"**, el sistema operativo Android/iOS mostrará la ventana nativa de solicitud de permiso.
7. **Resultados posibles:**
   - **Permitido:** La tarea se guarda, se agenda la alarma local y se guarda en la base de datos local y remota.
   - **No permitido:** La aplicación muestra un aviso amigable y **guarda la tarea de todos modos**, sin interrumpir el flujo del usuario.

### 3.3. Configuración del Lugar de Estudio (Ubicación Aproximada)
1. Diríjase a la pestaña **Perfil** en la barra inferior.
2. Observe que la aplicación muestra sus datos (Nombre, Correo) y el selector de tema (Claro/Oscuro).
3. Toque el botón **"Configurar lugar de estudio"**.
4. **Flujo de permiso contextual:**
   - Se despliega el mensaje de consentimiento:  
     > *"Usaremos tu ubicación aproximada una sola vez para guardar la zona donde estudias. No rastreamos tu ubicación en segundo plano."*
   - Toque **"Continuar"**.
5. Al conceder el permiso:
   - El sistema captura la posición actual.
   - Aplica automáticamente un redondeo a dos decimales (`~1.1 km`) para resguardar la privacidad.
   - En la pantalla de Perfil aparecerá una tarjeta destacada:  
     `📍 Zona de estudio configurada: Lat: -1.48, Lon: -77.99 (aproximada)`
   - Se sincroniza inmediatamente con el campo `ubicacion_estudio` del backend.

---

## 4. Matriz de Comportamiento y Degradación Elegante

| Estado del Dispositivo / Permiso | ¿Qué experimenta el usuario? | Comportamiento del Sistema |
| :--- | :--- | :--- |
| **Concedido (`granted`)** | Mensaje de éxito. Notificación programada o coordenadas visibles en Perfil. | Persistencia local inmediata + sincronización API con FastAPI. |
| **Denegado (`denied`)** | Alerta: *"Sin notificación / Sin ubicación"*. | La tarea se guarda normalmente. El perfil sigue navegable. No se bloquea la app. |
| **Denegado Permanente (`blocked`)** | Alerta con dos botones: **"Cancelar"** y **"Abrir Ajustes"**. | Al pulsar "Abrir Ajustes", el sistema invoca `Linking.openSettings()` abriendo la configuración de la app en Android/iOS. |
| **GPS Apagado (`services_disabled`)** | Alerta: *"Activa los servicios de ubicación del dispositivo y vuelve a intentarlo"*. | La función aborta limpiamente sin errores en consola ni cierres forzados. |
| **Sin Conexión / Modo Avión** | Alerta: *"Guardado sin conexión"*. | Se registra en SQLite local con bandera de pendiente y se envía automáticamente cuando se detecta conexión. |

---

## 5. Cumplimiento Técnico y Plataformas (Android 16 & iOS)

### 5.1. Nivel de API Objetivo (Android 16 / Target SDK 36)
En cumplimiento con la directiva de Google Play Store aplicable a partir del 31 de agosto de 2026:
- Archivo: `mobile/android/app/build.gradle`
- Configuración:
  ```groovy
  defaultConfig {
      applicationId 'com.estudiafacil.app'
      minSdkVersion rootProject.ext.minSdkVersion
      targetSdkVersion 36 // Android 16
      versionCode 1
      versionName "1.0.0"
  }
  ```

### 5.2. Permisos Declarados (Mínimo Privilegio)
- **Android (`mobile/app.json` & `AndroidManifest.xml`):**
  - `POST_NOTIFICATIONS`: Alertas locales de tareas en Android 13+.
  - `ACCESS_COARSE_LOCATION`: Ubicación por red/Wi-Fi (aproximada).
  - `ACCESS_FINE_LOCATION`: Requerido por el motor de ubicación de Android para resolver el proveedor en primer plano.
  - *No se declaran permisos de galería, cámara ni rastreo en segundo plano.*
- **iOS (`mobile/app.json`):**
  - `NSLocationWhenInUseUsageDescription`: *"EstudiaFácil usa tu ubicación aproximada solo cuando eliges guardar tu lugar de estudio."*
  - `NSUserNotificationUsageDescription`: *"EstudiaFácil envía recordatorios locales de las tareas que decidas programar."*

---

## 6. Guía de Ejecución de Pruebas en Dispositivo Físico

Para ejecutar las pruebas en tu teléfono físico conectado a la misma red Wi-Fi:

### Paso 1: Iniciar Backend
```bash
cd E:\estudiafacil\backend
.venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Paso 2: Configurar IP Local en el Móvil
Asegúrate de que en `mobile/.env` tu variable apunte a la IP de tu computadora (ejemplo: `http://192.168.1.15:8000`).

### Paso 3: Iniciar Expo
```bash
cd E:\estudiafacil\mobile
npx expo start
```
Escanea el código QR con la app **Expo Go** en tu celular Android o iOS.

---

## 7. Guion Exacto para la Grabación del Video (10/10)

> ⏱ **Duración total sugerida:** 2 minutos y medio a 3 minutos.  
> 📱 **Cámara / Screencast:** Graba la pantalla de tu teléfono físico o apúntale con una cámara.

### Minuto 0:00 - 0:30 | Introducción y Principio de Privacidad
- **Qué decir:** *"Saludos docente, a continuación presento la incorporación de capacidades nativas al prototipo EstudiaFácil. Como podemos observar en la pantalla del dispositivo físico, al abrir la aplicación no se solicita ningún permiso invasivo, cumpliendo con la política de solicitud al momento de uso."*
- **Qué mostrar:** Abrir la app, navegar por el Home y mostrar que no hay pop-ups molestos.

### Minuto 0:30 - 1:15 | Capacidad 1: Notificaciones Locales y Degradación
- **Qué decir:** *"Vamos a crear una tarea y activar el switch de recordatorio. Noten que primero la aplicación me explica para qué requiere el permiso. Al dar en Continuar y Conceder, la tarea se agenda y se almacena en SQLite local y en el backend."*
- **Demostración de rechazo:** *"Ahora creamos otra tarea con recordatorio, pero en el diálogo nativo seleccionamos 'No permitir'. Como pueden ver, la aplicación degrada elegantemente: muestra un aviso amigable y la tarea se guarda de todos modos sin cerrarse ni romperse."*

### Minuto 1:15 - 2:00 | Capacidad 2: Ubicación para Zona de Estudio
- **Qué decir:** *"En la pestaña Perfil tenemos la segunda capacidad nativa: configurar el lugar de estudio. Al tocar el botón, se nos informa que solo se usará una vez de forma aproximada. Concedemos el permiso y observamos cómo en pantalla se guardan las coordenadas con precisión reducida a dos decimales para proteger la privacidad del estudiante."*
- **Qué mostrar:** Tocar el botón, conceder permiso y mostrar el badge: `📍 Zona de estudio configurada: Lat: X.XX, Lon: Y.YY (aproximada)`.

### Minuto 2:00 - 2:35 | Degradación Permanente y Acceso a Ajustes
- **Qué decir:** *"Para cumplir con la gestión del estado bloqueado o denegación permanente, si denegamos el permiso con 'No volver a preguntar' o desde los ajustes, la app lo detecta y nos ofrece el botón directo 'Abrir Ajustes' para ir a la configuración del sistema operativo."*
- **Qué mostrar:** Tocar "Abrir Ajustes" y mostrar cómo se abre la configuración de la app en Android. También apagar el botón de GPS en la barra de notificaciones del teléfono y pulsar el botón para mostrar el mensaje de *"Ubicación desactivada"*.

### Minuto 2:35 - 3:00 | Modo Offline y Cierre
- **Qué decir:** *"Finalmente, activamos el Modo Avión en el teléfono. Si registramos un cambio, la app lo guarda en persistencia local SQLite/AsyncStorage indicando 'Guardado sin conexión'. Al reconectar los datos, el servicio de sincronización actualiza automáticamente el backend FastAPI."*
- **Qué mostrar:** Activar modo avión, guardar, desactivar modo avión y mostrar la sincronización.
