import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from "react-native";

import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { useAuth } from "../../hooks/useAuth";
import { validateRegisterForm } from "../../utils/validators";
import { API_URL } from "../../utils/constants";
import { colors } from "../../utils/colors";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const validation = validateRegisterForm({ nombre, email, password });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setLoading(true);
    try {
      await register(nombre, email, password);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((item) => item.msg).join("\n")
        : detail || `No hubo respuesta de ${API_URL}\n${err?.message || "Error de red"}`;
      Alert.alert("No se pudo crear la cuenta", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Crea tu cuenta</Text>
      <Text style={styles.subtitle}>Organiza tus materias y tareas en un solo lugar</Text>

      <CustomInput label="Nombre completo" value={nombre} onChangeText={setNombre} error={errors.nombre} placeholder="Tu nombre" />
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
        placeholder="Mínimo 8 caracteres"
      />

      <CustomButton title="Crear cuenta" onPress={handleRegister} loading={loading} />

      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.link}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: "700", color: colors.text },
  subtitle: { marginTop: 6, marginBottom: 24, fontSize: 14, color: colors.textLight },
  link: { marginTop: 16, alignItems: "center" },
  linkText: { color: colors.primary, fontWeight: "600" },
});
