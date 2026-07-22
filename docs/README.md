# 📘 EstudiaFácil

App de organización académica: gestiona materias, tareas, recordatorios y notificaciones.

## Estructura del proyecto

- **backend/** — API REST con FastAPI + PostgreSQL (autenticación JWT, arquitectura en capas: routes → services → repositories → models).
- **mobile/** — App móvil con React Native + Expo (React Navigation, Context API, Axios).
- **docs/** — Documentación del proyecto.
- **deploy/** — Configuración de despliegue en producción (Docker Compose, Nginx).

## Backend: cómo correrlo

```bash
cd backend
cp .env.example .env   # ajusta las variables si es necesario
python -m venv venv
source venv/bin/activate       # en Windows: venv\Scripts\activate
pip install -r requirements.txt

# Con Docker (recomendado, levanta también PostgreSQL):
docker-compose up --build

# Sin Docker (requiere PostgreSQL corriendo localmente):
alembic revision --autogenerate -m "inicial"
alembic upgrade head
uvicorn app.main:app --reload
```

La API queda disponible en `http://localhost:8000`, con documentación interactiva en `http://localhost:8000/docs`.

Tests:
```bash
pytest
```

## Mobile: cómo correrlo

```bash
cd mobile
npm install
npx expo start
```

Edita `mobile/.env` con la URL de tu backend (`API_URL`), y ábrelo con Expo Go en tu teléfono o un emulador.

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | /auth/register | Crear cuenta |
| POST | /auth/login | Iniciar sesión (devuelve JWT) |
| GET/PUT/DELETE | /users/me | Perfil del usuario |
| GET/POST/PUT/DELETE | /materias | Gestión de materias |
| GET/POST/PUT/DELETE | /tareas | Gestión de tareas |
| POST | /recordatorios | Crear recordatorio |
| GET/PATCH | /notificaciones | Notificaciones del usuario |

## Pendientes de contenido

Los siguientes archivos son solo placeholders y deben completarse manualmente:
- `docs/manual_usuario.pdf`, `docs/manual_tecnico.pdf`, `docs/presentacion.pptx` — pídeme que te los genere con contenido real cuando quieras (puedo crear PDF/PPTX reales).
- `docs/screenshots/*.png` — capturas reales de la app una vez corriendo.
- `mobile/assets/fonts/*.ttf` — ver `mobile/assets/fonts/LEEME.md`.
