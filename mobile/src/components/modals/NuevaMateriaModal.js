import React, { useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";

import CustomInput from "../common/CustomInput";
import CustomButton from "../common/CustomButton";
import { colors } from "../../utils/colors";

export default function NuevaMateriaModal({ visible, onClose, onSubmit }) {
  const [nombre, setNombre] = useState("");
  const [profesor, setProfesor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({ nombre, profesor });
      setNombre("");
      setProfesor("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Nueva materia</Text>
          <CustomInput label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Ej. Matemáticas" />
          <CustomInput label="Profesor" value={profesor} onChangeText={setProfesor} placeholder="Opcional" />
          <CustomButton title="Guardar materia" onPress={handleSubmit} loading={loading} />
          <CustomButton title="Cancelar" onPress={onClose} variant="outline" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 16, color: colors.text },
});
