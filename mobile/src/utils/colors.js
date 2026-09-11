export const lightPalette = {
  primary: "#3F51B5",
  onPrimary: "#FFFFFF",
  primaryContainer: "#E0E0FF",
  onPrimaryContainer: "#00006E",
  secondary: "#5C5D72",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#E1E0F9",
  onSecondaryContainer: "#191A2C",
  error: "#BA1A1A",
  onError: "#FFFFFF",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#410002",
  background: "#FEFBFF",
  onBackground: "#1B1B1F",
  surface: "#FDFBFF",
  onSurface: "#1B1B1F",
  surfaceVariant: "#E4E1EC",
  onSurfaceVariant: "#46464F",
  outline: "#777680",
  text: "#1B1B1F",
  textLight: "#46464F",
  border: "#E4E1EC",
};

export const darkPalette = {
  primary: "#BEC2FF",
  onPrimary: "#061D88",
  primaryContainer: "#25399F",
  onPrimaryContainer: "#E0E0FF",
  secondary: "#C5C4DD",
  onSecondary: "#2E2F42",
  secondaryContainer: "#444559",
  onSecondaryContainer: "#E1E0F9",
  error: "#FFB4AB",
  onError: "#690005",
  errorContainer: "#93000A",
  onErrorContainer: "#FFDAD6",
  background: "#1B1B1F",
  onBackground: "#E4E1E6",
  surface: "#1B1B1F",
  onSurface: "#E4E1E6",
  surfaceVariant: "#46464F",
  onSurfaceVariant: "#C7C5D0",
  outline: "#91909A",
  text: "#E4E1E6",
  textLight: "#C7C5D0",
  border: "#46464F",
};

export const colors = {
  ...lightPalette, // Default
  prioridad: {
    alta: "#BA1A1A",
    media: "#77536D",
    baja: "#3F51B5",
  },
  estado: {
    pendiente: "#ED6C02",
    en_progreso: "#3F51B5",
    completada: "#2E7D32",
  },
};

export default colors;
