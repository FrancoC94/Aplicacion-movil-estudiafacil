import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";

import { colors } from "../../utils/colors";

export default function CustomButton({ title, onPress, loading = false, variant = "primary", disabled = false }) {
  const isOutline = variant === "outline";
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isOutline ? styles.outline : styles.filled,
        (disabled || loading) && styles.disabled,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : "#fff"} />
      ) : (
        <Text style={isOutline ? styles.textOutline : styles.textFilled}>{title}</Text>
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
  filled: { backgroundColor: colors.primary },
  outline: { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: "transparent" },
  disabled: { opacity: 0.6 },
  textFilled: { color: "#fff", fontWeight: "600", fontSize: 16 },
  textOutline: { color: colors.primary, fontWeight: "600", fontSize: 16 },
});
