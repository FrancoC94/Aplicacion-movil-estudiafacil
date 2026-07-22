import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "../utils/colors";
import { STORAGE_KEYS } from "../utils/constants";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === "dark");

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (stored) setIsDark(stored === "dark");
    })();
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, next ? "dark" : "light");
  };

  const theme = {
    isDark,
    background: isDark ? colors.backgroundDark : colors.background,
    surface: isDark ? colors.surfaceDark : colors.surface,
    text: isDark ? colors.textDark : colors.text,
    primary: colors.primary,
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext debe usarse dentro de ThemeProvider");
  return ctx;
}
