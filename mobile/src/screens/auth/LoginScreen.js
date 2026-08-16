import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from "react-native";

import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { useAuth } from "../../hooks/useAuth";
import { HealthAPI } from "../../api/endpoints";
import { validateLoginForm } from "../../utils/validators";
import { colors } from "../../utils/colors";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkingApi, setCheckingApi] = useState(false);

  const handleLogin = async () => {
    const validation = validateLoginForm({ email, password });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert("Error", err?.response?.data?.detail || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleHealthCheck = async () => {
    setCheckingApi(true);
    try {
      const { data } = await HealthAPI.check();
      Alert.alert("API conectada", `Respuesta de /health: ${data.status}`);
    } catch (err) {
      const status = err?.response?.status ? ` (HTTP ${err.response.status})` : "";
      Alert.alert(
        "No se pudo conectar",
        `Verifica EXPO_PUBLIC_API_URL, que la API esté en ejecución y que el teléfono y PC compartan red${status}.`
      );
    } finally {
      setCheckingApi(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Bienvenido de vuelta</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar organizando tus estudios</Text>

      <CustomInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        error={errors.email}
        placeholder="tucorreo@ejemplo.com"
      />
      <CustomInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
        placeholder="••••••••"
      />

      <CustomButton title="Iniciar sesión" onPress={handleLogin} loading={loading} />
      <TouchableOpacity onPress={handleHealthCheck} disabled={checkingApi} style={styles.healthLink}>
        <Text style={styles.linkText}>{checkingApi ? "Verificando API..." : "Verificar conexión con la API"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.link}>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: "700", color: colors.text },
  subtitle: { marginTop: 6, marginBottom: 24, fontSize: 14, color: colors.textLight },
  link: { marginTop: 16, alignItems: "center" },
  healthLink: { marginTop: 20, alignItems: "center" },
  linkText: { color: colors.primary, fontWeight: "600" },
});
