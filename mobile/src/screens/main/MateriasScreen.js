import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";

import { MateriasAPI, TareasAPI } from "../../api/endpoints";
import MateriaCard from "../../components/cards/MateriaCard";
import NuevaMateriaModal from "../../components/modals/NuevaMateriaModal";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { colors } from "../../utils/colors";

export default function MateriasScreen() {
  const [materias, setMaterias] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const load = useCallback(async () => {
    const [materiasRes, tareasRes] = await Promise.all([MateriasAPI.list(), TareasAPI.list()]);
    setMaterias(materiasRes.data);
    setTareas(tareasRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pendientesPorMateria = (materiaId) =>
    tareas.filter((t) => t.materia_id === materiaId && t.estado !== "completada").length;

  const handleCreate = async (data) => {
    await MateriasAPI.create(data);
    await load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList
        data={materias}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MateriaCard materia={item} tareasPendientes={pendientesPorMateria(item.id)} onPress={() => {}} />
        )}
        ListEmptyComponent={<EmptyState title="Aún no tienes materias" subtitle="Agrega tu primera materia" />}
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <NuevaMateriaModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleCreate} />
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
