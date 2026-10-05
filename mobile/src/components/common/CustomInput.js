import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeContext } from "../../context/ThemeContext";

export default function CustomInput({ label, error, style, secureTextEntry, ...props }) {
  const { theme } = useThemeContext();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, { color: theme.text }]}>{label}</Text> : null}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: error ? theme.error : theme.border,
              color: theme.text,
              backgroundColor: theme.surface,
              paddingRight: secureTextEntry ? 48 : 14,
            },
            style,
          ]}
          placeholderTextColor={theme.textLight || "#888"}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCorrect={false}
          {...props}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Text style={styles.eyeText}>{showPassword ? "👁️" : "🙈"}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16, width: "100%" },
  label: { marginBottom: 6, fontSize: 14, fontWeight: "600" },
  inputWrapper: { position: "relative", justifyContent: "center", width: "100%" },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  eyeText: {
    fontSize: 18,
  },
  error: { marginTop: 4, fontSize: 12, fontWeight: "500" },
});
