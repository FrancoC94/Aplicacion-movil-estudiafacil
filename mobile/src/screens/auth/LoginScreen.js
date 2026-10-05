import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ScrollView, Image } from "react-native";

import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { useAuth } from "../../hooks/useAuth";
import { HealthAPI } from "../../api/endpoints";
import { validateLoginForm } from "../../utils/validators";
import { colors } from "../../utils/colors";

export default function LoginScreen({ navigation }) {
  const { login, loginOffline } = useAuth();
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
      const isNetworkError = !err?.response || err?.message?.includes("Network Error");
      if (isNetworkError) {
        Alert.alert(
          "Servidor no disponible",
          "No se pudo conectar con el backend en la PC. ¿Deseas ingresar en Modo Offline? Podrás usar la app normalmente con tus materias y tareas.",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Entrar en Modo Offline",
              onPress: () => loginOffline(email || "javif442@gmail.com", "Cristian"),
            },
          ]
        );
      } else {
        Alert.alert("Error", err?.response?.data?.detail || "No se pudo iniciar sesión");
      }
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
          <Text style={styles.title}>Bienvenido de vuelta</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar organizando tus estudios</Text>
        </View>

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

        <TouchableOpacity
          onPress={() => loginOffline(email || "javif442@gmail.com", "Cristian")}
          style={styles.offlineButton}
          activeOpacity={0.8}
        >
          <Text style={styles.offlineButtonText}>⚡ Entrar en Modo Offline</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleHealthCheck} disabled={checkingApi} style={styles.healthLink}>
          <Text style={styles.linkText}>{checkingApi ? "Verificando API..." : "Verificar conexión con la API"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.link}>
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
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
  logo: { width: 90, height: 90, borderRadius: 20, marginBottom: 12 },
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
  healthLink: { marginTop: 14, alignItems: "center" },
  linkText: { color: colors.primary, fontWeight: "600" },
});
