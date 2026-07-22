import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { TareasAPI } from "../../api/endpoints";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { colors } from "../../utils/colors";

export default function ProgresoScreen() {
  const [stats, setStats] = useState({ total: 0, completadas: 0, pendientes: 0, enProgreso: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await TareasAPI.list();
    setStats({
      total: data.length,
      completadas: data.filter((t) => t.estado === "completada").length,
      pendientes: data.filter((t) => t.estado === "pendiente").length,
      enProgreso: data.filter((t) => t.estado === "en_progreso").length,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingSpinner />;

  const porcentaje = stats.total > 0 ? Math.round((stats.completadas / stats.total) * 100) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu progreso</Text>
      <View style={styles.card}>
        <Text style={styles.percentage}>{porcentaje}%</Text>
        <Text style={styles.percentageLabel}>de tareas completadas</Text>
      </View>

      <View style={styles.row}>
        <StatBox label="Total" value={stats.total} color={colors.primary} />
        <StatBox label="Pendientes" value={stats.pendientes} color={colors.estado.pendiente} />
      </View>
      <View style={styles.row}>
        <StatBox label="En progreso" value={stats.enProgreso} color={colors.estado.en_progreso} />
        <StatBox label="Completadas" value={stats.completadas} color={colors.estado.completada} />
      </View>
    </View>
  );
}

function StatBox({ label, value, color }) {
  return (
    <View style={[styles.statBox, { borderColor: color }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 24, alignItems: "center", marginBottom: 20 },
  percentage: { fontSize: 40, fontWeight: "800", color: colors.primary },
  percentageLabel: { fontSize: 13, color: colors.textLight, marginTop: 4 },
  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
  statBox: { flex: 1, borderWidth: 1.5, borderRadius: 12, padding: 16, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "700" },
  statLabel: { fontSize: 12, color: colors.textLight, marginTop: 4 },
});
