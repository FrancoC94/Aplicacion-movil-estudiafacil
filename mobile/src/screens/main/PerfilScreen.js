import React from "react";
import { View, Text, StyleSheet } from "react-native";

import CustomButton from "../../components/common/CustomButton";
import { useAuth } from "../../hooks/useAuth";
import { useThemeContext } from "../../context/ThemeContext";
import { colors } from "../../utils/colors";

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.nombre?.[0]?.toUpperCase() || "?"}</Text>
      </View>
      <Text style={styles.nombre}>{user?.nombre}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.section}>
        <CustomButton title={isDark ? "Modo claro" : "Modo oscuro"} onPress={toggleTheme} variant="outline" />
        <View style={{ height: 12 }} />
        <CustomButton title="Cerrar sesión" onPress={logout} variant="outline" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, alignItems: "center" },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  avatarText: { fontSize: 32, color: "#fff", fontWeight: "700" },
  nombre: { marginTop: 16, fontSize: 18, fontWeight: "700", color: colors.text },
  email: { marginTop: 4, fontSize: 13, color: colors.textLight },
  section: { marginTop: 32, width: "100%" },
});
