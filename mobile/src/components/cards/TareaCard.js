import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

import { theme } from "../../utils/theme";
import { formatDate, isVencida, truncate } from "../../utils/helpers";

export default function TareaCard({ tarea, onPress }) {
  const vencida =
    tarea.estado !== "completada" &&
    isVencida(tarea.fecha_entrega);

  const prioridadColor =
    theme.colors.prioridad[tarea.prioridad] || theme.colors.primary;

  const estadoColor =
    theme.colors.estado[tarea.estado] || theme.colors.primary;

  const accessibilityLabel = [
    `Tarea ${tarea.titulo}`,
    tarea.descripcion ? `Descripción: ${tarea.descripcion}` : null,
    `Fecha de entrega: ${formatDate(tarea.fecha_entrega)}`,
    `Estado: ${tarea.estado.replace("_", " ")}`,
    tarea.prioridad ? `Prioridad: ${tarea.prioridad}` : null,
    vencida ? "Tarea vencida" : null,
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View
        style={[
          styles.priorityBar,
          { backgroundColor: prioridadColor },
        ]}
      />

      <View style={styles.content}>
        <Text style={styles.titulo} numberOfLines={1}>
          {tarea.titulo}
        </Text>

        {tarea.descripcion ? (
          <Text style={styles.descripcion} numberOfLines={2}>
            {truncate(tarea.descripcion, 100)}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <Text style={[styles.fecha, vencida && styles.vencida]}>
            {vencida ? "Vencida · " : ""}
            {formatDate(tarea.fecha_entrega)}
          </Text>

          <View
            style={[
              styles.badge,
              { backgroundColor: estadoColor },
            ]}
          >
            <Text style={styles.badgeText}>
              {tarea.estado.replace("_", " ")}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.md,
    overflow: "hidden",

    shadowColor: theme.colors.text,
    shadowOpacity: 0.05,
    shadowRadius: theme.spacing.sm,

    elevation: 2,
  },

  priorityBar: {
    width: 5,
  },

  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },

  titulo: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text,
  },

  descripcion: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.size.md,
    color: theme.colors.textSecondary,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.md,
  },

  fecha: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
  },

  vencida: {
    color: theme.colors.danger,
    fontWeight: theme.typography.weight.semibold,
  },

  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.radii.md,
  },

  badgeText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.onPrimary,
    fontWeight: theme.typography.weight.semibold,
    textTransform: "capitalize",
  },
});