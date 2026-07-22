import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";

import { TareasAPI, MateriasAPI } from "../../api/endpoints";
import TareaCard from "../../components/cards/TareaCard";
import NuevaTareaModal from "../../components/modals/NuevaTareaModal";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { colors } from "../../utils/colors";

export default function TareasScreen() {
  const [tareas, setTareas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const load = useCallback(async () => {
    const [tareasRes, materiasRes] = await Promise.all([TareasAPI.list(), MateriasAPI.list()]);
    setTareas(tareasRes.data);
    setMaterias(materiasRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (data) => {
    await TareasAPI.create(data);
    await load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList
        data={tareas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TareaCard tarea={item} onPress={() => {}} />}
        ListEmptyComponent={<EmptyState title="No tienes tareas" subtitle="Crea una tarea para empezar" />}
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        disabled={materias.length === 0}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {materias.length > 0 && (
        <NuevaTareaModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleCreate}
          materiaId={materias[0].id}
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
