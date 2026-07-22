import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, ScrollView } from "react-native";

import CustomInput from "../common/CustomInput";
import CustomButton from "../common/CustomButton";
import { colors } from "../../utils/colors";

export default function NuevaTareaModal({ visible, onClose, onSubmit, materiaId }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({ titulo, descripcion, fecha_entrega: fechaEntrega, materia_id: materiaId });
      setTitulo("");
      setDescripcion("");
      setFechaEntrega("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Nueva tarea</Text>
          <ScrollView>
            <CustomInput label="Título" value={titulo} onChangeText={setTitulo} placeholder="Ej. Entregar ensayo" />
            <CustomInput
              label="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Detalles de la tarea"
              multiline
            />
            <CustomInput
              label="Fecha de entrega (YYYY-MM-DD)"
              value={fechaEntrega}
              onChangeText={setFechaEntrega}
              placeholder="2026-08-01"
            />
          </ScrollView>
          <CustomButton title="Guardar tarea" onPress={handleSubmit} loading={loading} />
          <CustomButton title="Cancelar" onPress={onClose} variant="outline" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "85%" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 16, color: colors.text },
});
