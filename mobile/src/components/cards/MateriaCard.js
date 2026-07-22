import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function MateriaCard({ materia, tareasPendientes = 0, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: materia.color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.nombre}>{materia.nombre}</Text>
      {materia.profesor ? <Text style={styles.profesor}>{materia.profesor}</Text> : null}
      <View style={styles.footer}>
        <Text style={styles.tareas}>{tareasPendientes} tarea(s) pendiente(s)</Text>
        {materia.creditos ? <Text style={styles.creditos}>{materia.creditos} créditos</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  nombre: { fontSize: 16, fontWeight: "700", color: "#1A1F26" },
  profesor: { marginTop: 2, fontSize: 13, color: "#6B7280" },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  tareas: { fontSize: 12, color: "#6B7280" },
  creditos: { fontSize: 12, color: "#6B7280", fontWeight: "600" },
});
