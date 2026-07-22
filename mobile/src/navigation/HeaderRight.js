import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";

import { useNotifications } from "../hooks/useNotifications";
import { colors } from "../utils/colors";

// Nota: conecta este botón a una pantalla/modal de notificaciones cuando la agregues
// a la navegación (por ejemplo dentro de PerfilScreen o como pantalla modal del stack).
export default function HeaderRight() {
  const { noLeidas, notificaciones } = useNotifications();

  const handlePress = () => {
    if (notificaciones.length === 0) {
      Alert.alert("Notificaciones", "No tienes notificaciones todavía.");
      return;
    }
    Alert.alert("Notificaciones", `Tienes ${noLeidas} notificación(es) sin leer.`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Text style={styles.icon}>🔔</Text>
      {noLeidas > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{noLeidas}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { marginRight: 16 },
  icon: { fontSize: 20 },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});
