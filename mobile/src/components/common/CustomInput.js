import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { useThemeContext } from "../../context/ThemeContext";

export default function CustomInput({ label, error, style, ...props }) {
  const { theme } = useThemeContext();

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, { color: theme.text }]}>{label}</Text> : null}
      <TextInput
        style={[
            styles.input,
            {
                borderColor: theme.border,
                color: theme.text,
                backgroundColor: theme.surface
            },
            error && { borderColor: theme.error },
            style
        ]}
        placeholderTextColor={theme.textLight}
        {...props}
      />
      {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16, width: "100%" },
  label: { marginBottom: 6, fontSize: 14, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  error: { marginTop: 4, fontSize: 12 },
});
