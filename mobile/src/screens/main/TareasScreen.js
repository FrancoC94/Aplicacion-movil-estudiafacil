import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Alert, Linking } from "react-native";

import { syncService } from "../../services/syncService";
import { requestNotificationPermissions, scheduleLocalReminder } from "../../services/notificationService";
import TareaCard from "../../components/cards/TareaCard";
import NuevaTareaModal from "../../components/modals/NuevaTareaModal";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import OfflineBanner from "../../components/common/OfflineBanner";
import { colors } from "../../utils/colors";

export default function TareasScreen({ navigation }) {
  const [tareas, setTareas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const load = useCallback(async () => {
    const [tareasRes, materiasRes] = await Promise.all([
      syncService.getTareas(),
      syncService.getMaterias()
    ]);

    setTareas(tareasRes.data);
    setIsOffline(tareasRes.isOffline || materiasRes.isOffline);
    setLastSync(tareasRes.lastSync);
    setMaterias(materiasRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const unsubscribe = syncService.subscribeToNetwork(() => {
      load();
    });
    return () => unsubscribe();
  }, [load]);

  const askNotificationPermission = () => new Promise((resolve) => {
    Alert.alert(
      "Recordatorio de tarea",
      "Usaremos notificaciones locales únicamente para avisarte de esta tarea en tu dispositivo. Puedes continuar sin activar notificaciones.",
      [{ text: "Ahora no", style: "cancel", onPress: () => resolve(false) }, { text: "Continuar", onPress: () => resolve(true) }]
    );
  });

  const handleCreate = async (data) => {
    const { recordatorio, ...tareaData } = data;
    const result = await syncService.createTarea(tareaData);
    if (recordatorio) {
      const accepted = await askNotificationPermission();
      if (accepted) {
        const permission = await requestNotificationPermissions();
        if (permission === "granted") {
          try {
            const notificationId = await scheduleLocalReminder(
              "Recordatorio de tarea",
              tareaData.titulo,
              new Date(tareaData.fecha_entrega)
            );
            await syncService.saveReminder(result.data.id, notificationId, tareaData.fecha_entrega);
          } catch {
            Alert.alert("Recordatorio no programado", "La tarea se guardó, pero la fecha del recordatorio ya pasó o no está disponible.");
          }
        } else if (permission === "blocked") {
          Alert.alert("Notificaciones bloqueadas", "La tarea se creó sin recordatorio. Activa las notificaciones de EstudiaFácil en Ajustes si deseas usarlas.", [
            { text: "Cancelar", style: "cancel" },
            { text: "Abrir Ajustes", onPress: () => Linking.openSettings() },
          ]);
        } else {
          Alert.alert("Sin notificación", "La tarea se creó correctamente sin recordatorio porque no concediste el permiso.");
        }
      }
    }
    await load();
  };

  const handleFabPress = () => {
    if (materias.length === 0) {
      Alert.alert(
        "Sin materias",
        "Debes crear al menos una materia antes de agregar tareas.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Ir a Materias", onPress: () => navigation.navigate("Materias") }
        ]
      );
    } else {
      setModalVisible(true);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <OfflineBanner visible={isOffline} lastSync={lastSync} />
      <FlatList
        data={tareas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TareaCard tarea={item} onPress={() => {}} />}
        ListEmptyComponent={<EmptyState title="No tienes tareas" subtitle="Crea una tarea para empezar" />}
        contentContainerStyle={{ paddingBottom: 90, paddingHorizontal: 16, paddingTop: 16 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleFabPress}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {materias.length > 0 && (
        <NuevaTareaModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleCreate}
          materias={materias}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  fabText: { color: "#fff", fontSize: 28, marginTop: -2 },
});
