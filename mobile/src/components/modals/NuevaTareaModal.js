// Trigger reload
import React, { useState, useEffect } from "react";
import { Modal, View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import CustomInput from "../common/CustomInput";
import CustomButton from "../common/CustomButton";
import { colors } from "../../utils/colors";

export default function NuevaTareaModal({ visible, onClose, onSubmit, materias }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState(new Date());
  const [materiaId, setMateriaId] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (materias && materias.length > 0 && !materiaId) {
      setMateriaId(materias[0].id);
    }
  }, [materias, materiaId]);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fechaEntrega;
    setShowDatePicker(Platform.OS === 'ios');
    setFechaEntrega(currentDate);
  };

  const handleSubmit = async () => {
    if (!titulo || !materiaId) return;
    setLoading(true);
    try {
      await onSubmit({
        titulo,
        descripcion,
        fecha_entrega: fechaEntrega.toISOString().split('T')[0],
        materia_id: materiaId
      });
      setTitulo("");
      setDescripcion("");
      setFechaEntrega(new Date());
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

            <Text style={styles.label}>Materia</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={materiaId}
                onValueChange={(itemValue) => setMateriaId(itemValue)}
                style={styles.picker}
              >
                {materias.map((m) => (
                  <Picker.Item key={m.id} label={m.nombre} value={m.id} />
                ))}
              </Picker>
            </View>

            <CustomInput
              label="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Detalles de la tarea"
              multiline
            />

            <Text style={styles.label}>Fecha de entrega</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateDisplay}>
              <Text style={styles.dateText}>{fechaEntrega.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={fechaEntrega}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
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
  label: { fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8, marginTop: 12 },
  pickerContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 8,
    overflow: 'hidden'
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dateDisplay: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20
  },
  dateText: { fontSize: 16, color: colors.text },
});
