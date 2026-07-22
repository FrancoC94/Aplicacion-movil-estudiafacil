import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

import { colors } from "../../utils/colors";
import { formatDate, isVencida, truncate } from "../../utils/helpers";

export default function TareaCard({ tarea, onPress }) {
  const vencida = tarea.estado !== "completada" && isVencida(tarea.fecha_entrega);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.priorityBar, { backgroundColor: colors.prioridad[tarea.prioridad] }]} />
      <View style={styles.content}>
        <Text style={styles.titulo} numberOfLines={1}>{tarea.titulo}</Text>
        {tarea.descripcion ? (
          <Text style={styles.descripcion} numberOfLines={2}>{truncate(tarea.descripcion, 100)}</Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={[styles.fecha, vencida && styles.vencida]}>
            {vencida ? "Vencida · " : ""}{formatDate(tarea.fecha_entrega)}
          </Text>
          <View style={[styles.badge, { backgroundColor: colors.estado[tarea.estado] }]}>
            <Text style={styles.badgeText}>{tarea.estado.replace("_", " ")}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  priorityBar: { width: 5 },
  content: { flex: 1, padding: 14 },
  titulo: { fontSize: 15, fontWeight: "700", color: colors.text },
  descripcion: { marginTop: 4, fontSize: 13, color: colors.textLight },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  fecha: { fontSize: 12, color: colors.textLight },
  vencida: { color: colors.danger, fontWeight: "600" },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 11, color: "#fff", fontWeight: "600", textTransform: "capitalize" },
});
