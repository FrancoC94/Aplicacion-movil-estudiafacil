import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Linking } from "react-native";

import CustomButton from "../../components/common/CustomButton";
import { useAuth } from "../../hooks/useAuth";
import { useThemeContext } from "../../context/ThemeContext";
import { requestApproximateStudyLocation } from "../../services/locationService";
import { syncService } from "../../services/syncService";
import { storageService } from "../../services/storageService";

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useThemeContext();
  const [studyLocation, setStudyLocation] = useState(null);

  useEffect(() => {
    async function loadSavedLocation() {
      const local = await storageService.get("study_location");
      if (local) {
        setStudyLocation(local);
      } else if (user?.ubicacion_estudio) {
        try {
          const parsed = typeof user.ubicacion_estudio === "string"
            ? JSON.parse(user.ubicacion_estudio)
            : user.ubicacion_estudio;
          setStudyLocation(parsed);
        } catch {
          // ignore parsing error
        }
      }
    }
    loadSavedLocation();
  }, [user]);

  const confirmLocation = () => new Promise((resolve) => {
    Alert.alert(
      "Configurar lugar de estudio",
      "Usaremos tu ubicación aproximada una sola vez para guardar la zona donde estudias. No rastreamos tu ubicación en segundo plano.",
      [{ text: "Cancelar", style: "cancel", onPress: () => resolve(false) }, { text: "Continuar", onPress: () => resolve(true) }]
    );
  });

  const configureStudyLocation = async () => {
    if (!await confirmLocation()) return;
    const result = await requestApproximateStudyLocation();
    if (result.state === "granted") {
      const saved = await syncService.saveStudyLocation(result.location);
      setStudyLocation(result.location);
      Alert.alert(saved.synchronized ? "Lugar guardado" : "Guardado sin conexión", saved.synchronized
        ? "Tu zona de estudio aproximada se sincronizó con tu cuenta."
        : "Se guardó localmente y se sincronizará cuando vuelva la conexión.");
    } else if (result.state === "blocked") {
      Alert.alert("Ubicación bloqueada", "Activa el permiso de ubicación de EstudiaFácil en Ajustes para configurar tu lugar de estudio.", [
        { text: "Cancelar", style: "cancel" },
        { text: "Abrir Ajustes", onPress: () => Linking.openSettings() },
      ]);
    } else if (result.state === "services_disabled") {
      Alert.alert("Ubicación desactivada", "Activa los servicios de ubicación del dispositivo y vuelve a intentarlo.");
    } else if (result.state === "denied") {
      Alert.alert("Sin ubicación", "No guardamos ningún lugar porque no concediste el permiso. Puedes intentarlo más tarde.");
    } else {
      Alert.alert("Ubicación no disponible", "No fue posible obtener una ubicación aproximada en este momento.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
        <Text style={styles.avatarText}>{user?.nombre?.[0]?.toUpperCase() || "?"}</Text>
      </View>
      <Text style={[styles.nombre, { color: theme.text }]}>{user?.nombre}</Text>
      <Text style={[styles.email, { color: theme.textLight }]}>{user?.email}</Text>
      {studyLocation && (
        <View style={styles.locationContainer}>
          <Text style={[styles.locationBadge, { color: theme.primary }]}>📍 Zona de estudio configurada</Text>
          <Text style={[styles.location, { color: theme.textLight }]}>
            Lat: {studyLocation.latitude}, Lon: {studyLocation.longitude} ({studyLocation.precision || "aproximada"})
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <CustomButton
            title={theme.isDark ? "☀️ Modo claro" : "🌙 Modo oscuro"}
            onPress={toggleTheme}
            variant="outline"
        />
        <View style={{ height: 12 }} />
        <CustomButton title="Configurar lugar de estudio" onPress={configureStudyLocation} variant="outline" />
        <View style={{ height: 12 }} />
        <CustomButton title="Cerrar sesión" onPress={logout} variant="outline" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: "center" },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  avatarText: { fontSize: 32, color: "#fff", fontWeight: "700" },
  nombre: { marginTop: 16, fontSize: 18, fontWeight: "700" },
  email: { marginTop: 4, fontSize: 13 },
  locationContainer: {
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(74, 144, 217, 0.08)",
    alignItems: "center",
  },
  locationBadge: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  location: { fontSize: 12, textAlign: "center" },
  section: { marginTop: 32, width: "100%" },
});

