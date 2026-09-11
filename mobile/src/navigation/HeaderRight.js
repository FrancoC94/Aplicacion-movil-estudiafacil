import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useNotificationContext } from "../context/NotificationContext";
import { colors } from "../utils/colors";

export default function HeaderRight() {
  const { noLeidas } = useNotificationContext();
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("Notificaciones");
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
