import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors } from "../../utils/colors";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>📘</Text>
      <Text style={styles.title}>EstudiaFácil</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary },
  logo: { fontSize: 56 },
  title: { marginTop: 12, fontSize: 22, fontWeight: "700", color: "#fff" },
});
