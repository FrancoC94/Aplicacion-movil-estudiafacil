import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors } from "../../utils/colors";

export default function EmptyState({ title = "Nada por aquí todavía", subtitle = "" }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", paddingVertical: 60, paddingHorizontal: 24 },
  title: { fontSize: 16, fontWeight: "600", color: colors.text, textAlign: "center" },
  subtitle: { marginTop: 6, fontSize: 13, color: colors.textLight, textAlign: "center" },
});
