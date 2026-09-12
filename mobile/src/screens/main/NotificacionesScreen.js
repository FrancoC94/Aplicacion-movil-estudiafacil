import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNotificationContext } from '../../context/NotificationContext';
import { colors } from '../../utils/colors';

export default function NotificacionesScreen() {
  const { notificaciones, marcarLeida } = useNotificationContext();

  const renderItem = ({ item }) => (
    <View style={[styles.card, item.leida && styles.readCard]}>
      <View style={styles.content}>
        {item.titulo ? <Text style={styles.title}>{item.titulo}</Text> : null}
        <Text style={styles.message}>{item.mensaje}</Text>
        <Text style={styles.date}>
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
        </Text>
      </View>
      {!item.leida && (
        <TouchableOpacity style={styles.button} onPress={() => marcarLeida(item.id)}>
          <Text style={styles.buttonText}>Leída</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notificaciones}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No tienes notificaciones</Text>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16 },
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  readCard: { opacity: 0.6 },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  message: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  date: { fontSize: 12, color: colors.textSecondary },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 40, color: colors.textLight },
});
