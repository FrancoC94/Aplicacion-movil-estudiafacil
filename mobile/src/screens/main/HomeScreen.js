import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";

import { TareasAPI } from "../../api/endpoints";
import TareaCard from "../../components/cards/TareaCard";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { colors } from "../../utils/colors";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await TareasAPI.list();
      const pendientes = data
        .filter((t) => t.estado !== "completada")
        .sort((a, b) => new Date(a.fecha_entrega) - new Date(b.fecha_entrega));
      setTareas(pendientes.slice(0, 10));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola, {user?.nombre?.split(" ")[0] || "estudiante"} 👋</Text>
      <Text style={styles.subtitle}>Tus próximas tareas</Text>

      <FlatList
        data={tareas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TareaCard tarea={item} onPress={() => navigation.navigate("Tareas")} />
        )}
        ListEmptyComponent={<EmptyState title="No tienes tareas pendientes" subtitle="¡Vas muy bien!" />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  greeting: { fontSize: 20, fontWeight: "700", color: colors.text },
  subtitle: { marginTop: 4, marginBottom: 16, fontSize: 14, color: colors.textLight },
});
