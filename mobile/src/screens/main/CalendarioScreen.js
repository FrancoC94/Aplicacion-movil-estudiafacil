import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

import { TareasAPI } from "../../api/endpoints";
import { colors } from "../../utils/colors";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function CalendarioScreen() {
  const [marked, setMarked] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await TareasAPI.list();
    const marks = {};
    data.forEach((tarea) => {
      const fecha = tarea.fecha_entrega.split("T")[0];
      marks[fecha] = { marked: true, dotColor: colors.estado[tarea.estado] };
    });
    setMarked(marks);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={marked}
        theme={{
          selectedDayBackgroundColor: colors.primary,
          todayTextColor: colors.primary,
          arrowColor: colors.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
