import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ScrollView, Image } from "react-native";

import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { useAuth } from "../../hooks/useAuth";
import { validateRegisterForm } from "../../utils/validators";
import { API_URL } from "../../utils/constants";
import { colors } from "../../utils/colors";

export default function RegisterScreen({ navigation }) {
  const { register, loginOffline } = useAuth();
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
      const isNetwork = !err?.response || err?.message?.includes("Network Error");
      if (isNetwork) {
        Alert.alert(
          "Servidor no disponible",
          "No se pudo conectar con el servidor para registrar la cuenta. ¿Deseas ingresar en Modo Offline? Podrás usar la app y se sincronizará cuando el servidor esté activo.",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Entrar en Modo Offline",
              onPress: () => loginOffline(email || "javif442@gmail.com", nombre || "Cristian"),
            },
          ]
        );
      } else {
        const detail = err?.response?.data?.detail;
        const message = Array.isArray(detail)
          ? detail.map((item) => item.msg).join("\n")
          : detail || "No se pudo crear la cuenta";
        Alert.alert("No se pudo crear la cuenta", message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>Organiza tus materias y tareas en un solo lugar</Text>
        </View>

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

        <TouchableOpacity
          onPress={() => loginOffline(email || "javif442@gmail.com", nombre || "Cristian")}
          style={styles.offlineButton}
          activeOpacity={0.8}
        >
          <Text style={styles.offlineButtonText}>⚡ Continuar en Modo Offline</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.link}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: { alignItems: "center", marginBottom: 20 },
  logo: { width: 80, height: 80, borderRadius: 18, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "700", color: colors.text, textAlign: "center" },
  subtitle: { marginTop: 6, marginBottom: 16, fontSize: 14, color: colors.textLight, textAlign: "center" },
  offlineButton: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#0284C7",
    backgroundColor: "#F0F9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  offlineButtonText: {
    color: "#0369A1",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  link: { marginTop: 16, alignItems: "center" },
  linkText: { color: colors.primary, fontWeight: "600" },
});
