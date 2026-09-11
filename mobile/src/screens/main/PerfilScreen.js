import React from "react";
import { View, Text, StyleSheet } from "react-native";

import CustomButton from "../../components/common/CustomButton";
import { useAuth } from "../../hooks/useAuth";
import { useThemeContext } from "../../context/ThemeContext";

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
        <Text style={styles.avatarText}>{user?.nombre?.[0]?.toUpperCase() || "?"}</Text>
      </View>
      <Text style={[styles.nombre, { color: theme.text }]}>{user?.nombre}</Text>
      <Text style={[styles.email, { color: theme.textLight }]}>{user?.email}</Text>

      <View style={styles.section}>
        <CustomButton
            title={theme.isDark ? "☀️ Modo claro" : "🌙 Modo oscuro"}
            onPress={toggleTheme}
            variant="outline"
        />
        <View style={{ height: 12 }} />
        <CustomButton title="Cerrar sesión" onPress={logout} variant="outline" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: "center" },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  avatarText: { fontSize: 32, color: "#fff", fontWeight: "700" },
  nombre: { marginTop: 16, fontSize: 18, fontWeight: "700" },
  email: { marginTop: 4, fontSize: 13 },
  section: { marginTop: 32, width: "100%" },
});
