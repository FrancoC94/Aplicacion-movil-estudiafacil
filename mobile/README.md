# EstudiaFácil Mobile

Cliente móvil multiplataforma construido con **Expo SDK 54**, React Native 0.81.5 y React 19.1.0. Consume la API FastAPI del directorio `../backend`.

## Decisión técnica: Expo + React Native

Se seleccionó React Native con Expo (flujo administrado) porque el proyecto ya está implementado con este stack y permite mantener una sola base JavaScript para Android e iOS. Expo aporta Metro, recarga rápida y ejecución con Expo Go sin crear ni mantener proyectos nativos al inicio. La aplicación usa librerías nativas compatibles con Expo (`expo-secure-store`, `expo-notifications` y `expo-network`), por lo que no se justifica pasar a un flujo bare en esta etapa.

La contrapartida es que Expo Go no permite personalizar la configuración nativa de seguridad de red. Si la app se distribuye o requiere HTTP fuera del desarrollo local, se debe crear un development build y usar HTTPS; no se habilitará tráfico HTTP de forma global.

## Requisitos verificados

- Windows 11 (host de desarrollo)
- Node.js 22.23.1 y npm 10.9.8
- Expo SDK 54 (dependencia local del proyecto)
- Python 3.12.13 para el backend (FastAPI 0.115.0 y Uvicorn 0.30.6)
- Un teléfono Android/iOS con **Expo Go** o un emulador Android/iOS

No instale Expo CLI globalmente: los comandos `npm run` usan la versión incluida en el proyecto y hacen el entorno reproducible.

## Instalación del entorno en cada equipo

1. Instale Node.js 22 LTS y Git. Compruebe con `node --version` y `npm --version`.
2. Instale Visual Studio Code y las extensiones **Expo Tools**, **React Native Tools**, **ESLint** y **Prettier**. Abra el directorio `mobile` como carpeta de trabajo.
3. Para Android, elija una de estas alternativas:
   - **Teléfono físico (decisión recomendada para este equipo):** instale Expo Go, conecte el teléfono y el PC a la misma red Wi-Fi y no requiere Android Studio ni ADB.
   - **Emulador:** instale Android Studio, Android SDK Platform 35, Build Tools y un AVD. Verifique con `adb devices` y ejecute `npm run android`.
4. Para iOS se requiere macOS con Xcode; en Windows se utiliza Android o teléfono físico.

El equipo evaluado no expuso `adb`, Java ni Docker Desktop activo durante la verificación. Por ello, el teléfono físico con Expo Go es el destino justificable de menor consumo de recursos. Antes de grabar la entrega, conecte el teléfono y confirme que Expo Go abre el QR; no sustituya esa evidencia con una captura de escritorio.

## Configuración reproducible

1. Inicie PostgreSQL y la API desde `backend`. Con Docker:

   ```powershell
   cd ..\backend
   docker compose up --build
   ```

   Alternativamente, cree el entorno virtual, instale las dependencias, asegure que PostgreSQL esté disponible y ejecute la API:

   ```powershell
   cd ..\backend
   py -3.12 -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

2. Compruebe que la API responde en el host:

   ```powershell
   Invoke-RestMethod http://localhost:8000/health
   # Resultado esperado: status = healthy
   ```

3. En `mobile`, instale dependencias bloqueadas y configure la URL:

   ```powershell
   cd ..\mobile
   npm ci
   Copy-Item .env.example .env
   ```

   Edite `EXPO_PUBLIC_API_URL` según el destino:

   | Destino | URL |
   | --- | --- |
   | Teléfono físico en la misma Wi-Fi | `http://<IPv4-LAN-del-PC>:8000` |
   | Emulador Android Studio | `http://10.0.2.2:8000` |
   | Simulador iOS | `http://localhost:8000` |

   Para ver la IPv4 LAN en Windows: `ipconfig`. No use `localhost` en un teléfono físico: apunta al propio teléfono.

4. Ejecute la aplicación:

   ```powershell
   npm start
   ```

   Abra el QR con Expo Go (mismo Wi-Fi) o pulse `a` para Android / `i` para iOS. Si la red impide descubrir Metro, use `npx expo start --tunnel`.

5. Compruebe la recarga rápida: con Metro abierto, cambie un texto visible de `src/screens/auth/LoginScreen.js`, guarde el archivo y muestre cómo Expo Go actualiza la pantalla sin reinstalar la aplicación. Si no ocurre, pulse `r` en Metro o reinicie con `npx expo start --clear`.

## Diagnóstico obligatorio

Ejecute el diagnóstico completo desde `mobile` y muestre **la salida íntegra** en la grabación:

```powershell
npx expo-doctor
```

El diagnóstico debe terminar sin hallazgos pendientes antes de la entrega. Si informa incompatibilidades, ejecute `npx expo install --fix` y vuelva a ejecutar `npx expo-doctor`. Si informa paquetes no usados o faltantes, corríjalos en `package.json` con `npx expo install <paquete>` y reinstale mediante `npm ci`.

No se debe afirmar en el video que Android Studio, un AVD o un teléfono están configurados si no se muestran: el diagnóstico y el destino son evidencia por equipo y deben repetirse en cada integrante del grupo.

## Demostración de integración

En la pantalla de inicio de sesión pulse **“Verificar conexión con la API”**. La app ejecuta `GET {EXPO_PUBLIC_API_URL}/health`; la evidencia correcta es el aviso **“API conectada”** con `healthy`. La implementación está en `src/api/endpoints.js` y `src/screens/auth/LoginScreen.js`.

Verificación realizada el 16-08-2026: FastAPI respondió `HTTP 200 {"status":"healthy"}` tanto en `localhost:8000` como en `192.168.1.19:8000`. Esta última es la misma dirección LAN configurada para Expo Go. La prueba unitaria `npm run test -- --runInBand` también confirma que el cliente móvil solicita `/health`.

## URL de desarrollo y tráfico local acotado

La configuración reside en `.env`, que está ignorado por Git:

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.1.19:8000
```

`EXPO_PUBLIC_` es obligatorio para que Expo incorpore la variable al bundle de desarrollo. Esta variable **no debe contener secretos**. La dirección `192.168.1.19` es la IPv4 privada del PC anfitrión; `localhost` no sirve en el teléfono porque allí apunta al propio dispositivo. Se obtiene nuevamente con `ipconfig` si la red cambia.

La exposición se limita a la LAN de desarrollo: Uvicorn escucha en el puerto 8000 para permitir la conexión desde el teléfono y el firewall de Windows debe permitir TCP 8000 solo en el perfil **Privado**, nunca Público. No cree reglas con alcance Any/Internet. CORS ya está definido en el backend para sus orígenes de desarrollo; React Native no depende de CORS, pero sí de la regla de firewall y de que ambos equipos estén en la misma red.

## Seguridad de desarrollo

- `.env` está ignorado por Git y no debe contener secretos; solo una URL de desarrollo.
- Para producción use HTTPS y una URL pública controlada; no exponga el servidor de desarrollo en Internet.
- El backend debe iniciarse con `--host 0.0.0.0` solo para que sea alcanzable dentro de la LAN y el firewall debe permitir TCP 8000 únicamente en red privada.
- Los tokens de sesión se almacenan mediante Expo SecureStore; no se incluyen en este repositorio.

## Estructura que se debe recorrer en el video

```text
mobile/
├── .env.example             # plantilla de URL, sin secretos
├── App.js                   # punto de entrada
├── src/
│   ├── api/                 # axios y endpoints, incluido GET /health
│   ├── screens/auth/        # LoginScreen y botón de verificación
│   ├── navigation/          # navegación de la app
│   └── utils/constants.js   # lectura de EXPO_PUBLIC_API_URL
└── tests/health.test.js     # prueba del endpoint del cliente
```

## Guion mínimo de evidencia

1. Muestre versiones: `node --version`, `npm --version`, `npx expo --version` y las versiones del `package.json`.
2. Ejecute y muestre la salida completa de `npx expo-doctor` sin pendientes.
3. Recorra la estructura anterior y explique por qué Expo/React Native fue elegido.
4. Muestre el destino físico o AVD, inicie `npm start`, abra la app y haga una modificación visible para evidenciar recarga rápida.
5. Muestre la IPv4 con `ipconfig`, el `.env` sin secretos y explique por qué se usa esa IP en vez de `localhost`.
6. Con la API activa, pulse “Verificar conexión con la API” y muestre el mensaje `API conectada` con `healthy`; en paralelo, muestre el log HTTP 200 de Uvicorn.
7. Declare las limitaciones: no usar HTTP fuera de la LAN, necesidad de HTTPS en distribución y la elección de teléfono físico si el AVD excede los recursos del equipo.
