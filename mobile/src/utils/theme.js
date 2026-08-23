export const primitives = {
  colors: {
    blue500: "#4A90D9",
    blue700: "#3670A8",
    orange500: "#F5A623",
    green500: "#4CAF50",
    red500: "#E74C3C",

    gray50: "#F7F9FC",
    gray100: "#E1E5EA",
    gray500: "#6B7280",
    gray900: "#1A1F26",

    white: "#FFFFFF",

    darkBackground: "#12161C",
    darkSurface: "#1E242C",
    darkText: "#F1F3F5",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
    huge: 60,
  },

  radii: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    pill: 999,
  },

  typography: {
    family: {
      regular: "System",
      medium: "System",
      semibold: "System",
      bold: "System",
    },

    size: {
      xs: 11,
      sm: 12,
      md: 13,
      lg: 15,
      xl: 16,
      xxl: 20,
      xxxl: 24,
    },

    weight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },

    lineHeight: {
      sm: 16,
      md: 20,
      lg: 24,
      xl: 28,
      xxl: 32,
    },
  },
};

export const semantic = {
  colors: {
    primary: primitives.colors.blue500,
    primaryPressed: primitives.colors.blue700,

    background: primitives.colors.gray50,
    surface: primitives.colors.white,

    text: primitives.colors.gray900,
    textSecondary: primitives.colors.gray500,

    border: primitives.colors.gray100,

    success: primitives.colors.green500,
    warning: primitives.colors.orange500,
    danger: primitives.colors.red500,

    onPrimary: primitives.colors.white,
    onDanger: primitives.colors.white,

    prioridad: {
      alta: primitives.colors.red500,
      media: primitives.colors.orange500,
      baja: primitives.colors.green500,
    },

    estado: {
      pendiente: primitives.colors.orange500,
      en_progreso: primitives.colors.blue500,
      completada: primitives.colors.green500,
    },
  },

  spacing: primitives.spacing,
  radii: primitives.radii,
  typography: primitives.typography,
};

export const theme = {
  ...semantic,
};

export default theme;