import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { theme } from "../../utils/theme";

export default function EmptyState({
  title = "Nada por aquí todavía",
  subtitle = "",
}) {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={
        subtitle ? `${title}. ${subtitle}` : title
      }
    >
      <Text style={styles.title}>{title}</Text>

      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.huge,
    paddingHorizontal: theme.spacing.xl,
  },

  title: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text,
    textAlign: "center",
  },

  subtitle: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.size.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});