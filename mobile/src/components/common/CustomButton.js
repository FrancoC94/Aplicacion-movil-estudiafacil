import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useThemeContext } from "../../context/ThemeContext";

export default function CustomButton({ title, onPress, loading = false, variant = "primary", disabled = false }) {
  const { theme } = useThemeContext();
  const isOutline = variant === "outline";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isOutline
          ? [styles.outline, { borderColor: theme.primary }]
          : [styles.filled, { backgroundColor: theme.primary }],
        (disabled || loading) && styles.disabled,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? theme.primary : "#fff"} />
      ) : (
        <Text style={isOutline ? [styles.textOutline, { color: theme.primary }] : styles.textFilled}>
            {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  filled: { },
  outline: { borderWidth: 1.5, backgroundColor: "transparent" },
  disabled: { opacity: 0.6 },
  textFilled: { color: "#fff", fontWeight: "600", fontSize: 16 },
  textOutline: { fontWeight: "600", fontSize: 16 },
});
