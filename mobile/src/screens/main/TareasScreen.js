import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";

import { syncService } from "../../services/syncService";
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

  const handleCreate = async (data) => {
    await syncService.createTarea(data);
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
