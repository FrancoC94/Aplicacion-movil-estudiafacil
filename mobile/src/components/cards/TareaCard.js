import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useThemeContext } from "../../context/ThemeContext";
import { formatDate, isVencida, truncate } from "../../utils/helpers";

export default function TareaCard({ tarea, onPress }) {
  const { theme } = useThemeContext();
  const vencida = tarea.estado !== "completada" && isVencida(tarea.fecha_entrega);

  return (
    <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.outline + '20' }]}
        onPress={onPress}
        activeOpacity={0.7}
    >
      <View style={[styles.priorityIndicator, { backgroundColor: theme.prioridad[tarea.prioridad] }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.titulo, { color: theme.onSurface }]} numberOfLines={1}>{tarea.titulo}</Text>
          <View style={[styles.badge, { backgroundColor: theme.estado[tarea.estado] + '20' }]}>
            <Text style={[styles.badgeText, { color: theme.estado[tarea.estado] }]}>
              {tarea.estado.replace("_", " ")}
            </Text>
          </View>
        </View>

        {tarea.descripcion ? (
          <Text style={[styles.descripcion, { color: theme.onSurfaceVariant }]} numberOfLines={2}>
            {truncate(tarea.descripcion, 100)}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <Text style={[styles.fecha, { color: theme.onSurfaceVariant }, vencida && { color: theme.error }]}>
            {tarea.pendingSync === 1 ? "🕒 " : ""}
            {vencida ? "Vencida · " : ""}{formatDate(tarea.fecha_entrega)}
          </Text>
          {tarea.materia_nombre && (
            <Text style={[styles.materia, { color: theme.primary, backgroundColor: theme.primaryContainer }]}>
              {tarea.materia_nombre}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
  },
  priorityIndicator: { width: 6 },
  content: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  titulo: { fontSize: 16, fontFamily: "Poppins_600SemiBold", flex: 1, marginRight: 8 },
  descripcion: { fontSize: 14, fontFamily: "Poppins_400Regular", lineHeight: 20, marginBottom: 12 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  fecha: { fontSize: 12, fontFamily: "Poppins_500Medium" },
  materia: { fontSize: 12, fontFamily: "Poppins_600SemiBold", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontFamily: "Poppins_700Bold", textTransform: "uppercase" },
});
