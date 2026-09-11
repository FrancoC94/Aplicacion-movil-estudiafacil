import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useThemeContext } from "../../context/ThemeContext";

export default function LoadingSpinner({ size = "large" }) {
  const { theme } = useThemeContext();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size={size} color={theme.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
