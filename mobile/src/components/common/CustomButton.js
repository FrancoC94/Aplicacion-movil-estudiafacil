import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { theme } from "../../utils/theme";

export default function CustomButton({
  title,
  onPress,
  loading = false,
  variant = "primary",
  disabled = false,
}) {
  const isOutline = variant === "outline";
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        isOutline ? styles.outline : styles.filled,
        isDisabled && styles.disabled,
      ]}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={loading ? `${title}, cargando` : title}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
    >
      {loading ? (
        <ActivityIndicator
          color={
            isOutline
              ? theme.colors.primary
              : theme.colors.onPrimary
          }
        />
      ) : (
        <Text
          style={
            isOutline
              ? styles.textOutline
              : styles.textFilled
          }
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  filled: {
    backgroundColor: theme.colors.primary,
  },

  outline: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    backgroundColor: "transparent",
  },

  disabled: {
    opacity: 0.6,
  },

  textFilled: {
    color: theme.colors.onPrimary,
    fontWeight: theme.typography.weight.semibold,
    fontSize: theme.typography.size.xl,
  },

  textOutline: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weight.semibold,
    fontSize: theme.typography.size.xl,
  },
});