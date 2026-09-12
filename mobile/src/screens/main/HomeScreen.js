import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";

import { syncService } from "../../services/syncService";
import TareaCard from "../../components/cards/TareaCard";
import ProgressCircle from "../../components/common/ProgressCircle";
import SkeletonTarea from "../../components/skeletons/SkeletonTarea";
import EmptyState from "../../components/common/EmptyState";
import OfflineBanner from "../../components/common/OfflineBanner";
import { useAuth } from "../../hooks/useAuth";
import { useThemeContext } from "../../context/ThemeContext";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const [tareas, setTareas] = useState([]);
  const [totalTareas, setTotalTareas] = useState(0);
  const [completadas, setCompletadas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data, isOffline: offline, lastSync: syncTime } = await syncService.getTareas();
      setIsOffline(offline);
      setLastSync(syncTime);
      setTotalTareas(data.length);

      const done = data.filter(t => t.estado === "completada").length;
      setCompletadas(done);

      const pendientes = data
        .filter((t) => t.estado !== "completada")
        .sort((a, b) => new Date(a.fecha_entrega) - new Date(b.fecha_entrega));
      setTareas(pendientes.slice(0, 5));
    } finally {
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 800);
    }
  }, []);

  useEffect(() => {
    load();
    const unsubscribe = syncService.subscribeToNetwork(() => {
      load();
    });
    return () => unsubscribe();
  }, [load]);

  const progress = totalTareas > 0 ? (completadas / totalTareas) * 100 : 0;

  const renderHeader = () => (
    <View style={[styles.headerCard, { backgroundColor: theme.primaryContainer }]}>
      <View style={styles.headerInfo}>
        <Text style={[styles.greeting, { color: theme.onPrimaryContainer }]}>
            Hola, {user?.nombre?.split(" ")[0] || "estudiante"} 👋
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.onPrimaryContainer }]}>
          Has completado {completadas} de {totalTareas} tareas
        </Text>
      </View>
      <ProgressCircle
        progress={progress}
        size={70}
        strokeWidth={8}
        color={theme.primary}
      />
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.content}>
          <View style={[styles.headerCard, { backgroundColor: theme.surfaceVariant + '40' }]} />
          <Text style={[styles.sectionTitle, { color: theme.onSurface, marginTop: 24 }]}>Próximas tareas</Text>
          <SkeletonTarea />
          <SkeletonTarea />
          <SkeletonTarea />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <OfflineBanner visible={isOffline} lastSync={lastSync} />
      <FlatList
        data={tareas}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <>
            {renderHeader()}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.onSurface }]}>Próximas tareas</Text>
              <Text
                style={[styles.seeAll, { color: theme.primary }]}
                onPress={() => navigation.navigate("Tareas")}
              >
                Ver todas
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TareaCard
            tarea={item}
            onPress={() => navigation.navigate("Tareas")}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No tienes tareas pendientes"
            subtitle="¡Vas muy bien con tus estudios!"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            colors={[theme.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
  listContent: { padding: 16, paddingBottom: 32 },
  headerCard: {
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerInfo: { flex: 1, marginRight: 16 },
  greeting: { fontSize: 22, fontFamily: "Poppins_700Bold" },
  headerSubtitle: { marginTop: 4, fontSize: 14, fontFamily: "Poppins_400Regular", opacity: 0.8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontFamily: "Poppins_600SemiBold" },
  seeAll: { fontSize: 14, fontFamily: "Poppins_600SemiBold" }
});
