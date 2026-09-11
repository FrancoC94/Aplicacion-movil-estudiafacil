# Plan de Mejora: "EstudiaFácil Professional Edition"

Este plan detalla la evolución estética y funcional de la app para alcanzar un estándar profesional, utilizando principios de **Material Design 3 (M3)** y mejorando la retención del usuario mediante una mejor UX.

## User Review Required

> [!IMPORTANT]
> - Se instalarán las librerías `@expo-google-fonts/poppins` y `react-native-svg` (para gráficos).
> - Se cambiará la paleta de colores actual por una basada en tonalidades M3 (Tonal Palettes).
> - La fuente **Poppins** se aplicará globalmente, reemplazando la fuente del sistema.

## Proposed Changes

### 1. Identidad Visual y Tipografía (M3)

#### [MODIFY] [colors.js](file:///E:/estudiafacil/mobile/src/utils/colors.js)
- Actualizar a una paleta M3: `primary` (Indigo/Blue moderno), `secondary` (Soft Teal), y superficies neutras con elevación tonal.
- Definir colores para estados de error y éxito más sutiles.

#### [MODIFY] [App.js](file:///E:/estudiafacil/mobile/src/App.js)
- Implementar la carga de fuentes mediante `@expo-google-fonts/poppins`.
- Añadir un estado de "Splash Screen" mientras las fuentes y la sesión se cargan.

---

### 2. Dashboard y Componentes Profesionales

#### [NEW] [ProgressCircle.js](file:///E:/estudiafacil/mobile/src/components/common/ProgressCircle.js)
- Crear un indicador visual circular para el `HomeScreen` que muestre el % de tareas completadas del día.

#### [MODIFY] [TareaCard.js](file:///E:/estudiafacil/mobile/src/components/cards/TareaCard.js)
- Rediseñar el layout: bordes más redondeados (16px), sombras suaves (elevation 1 o 2), y mejor jerarquía visual en la fecha de entrega.
- Añadir micro-interacciones al presionar.

---

### 3. Experiencia de Usuario (UX)

#### [NEW] [SkeletonTarea.js](file:///E:/estudiafacil/mobile/src/components/skeletons/SkeletonTarea.js)
- Implementar pantallas de carga "esqueleto" para que la app no parezca vacía mientras carga los datos de SQLite o la API.

#### [MODIFY] [HomeScreen.js](file:///E:/estudiafacil/mobile/src/screens/main/HomeScreen.js)
- Integrar el nuevo encabezado de progreso y la carga con esqueletos.
- Mejorar el espaciado general siguiendo la regla de los 8dp.

## Verification Plan

### Manual Verification
1. **Consistencia Visual**: Abrir la app y verificar que todos los textos usen Poppins.
2. **Modo Offline**: Desactivar red y verificar que el `OfflineBanner` ahora tenga un diseño minimalista que no obstruya la navegación.
3. **Carga**: Al abrir la app, verificar que se ven los "Esqueletos" antes de mostrar las tareas reales.
4. **Interactividad**: Probar el scroll y la presión en las tarjetas para asegurar una respuesta táctil fluida.
