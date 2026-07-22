import React from "react";
import { View, Text, StyleSheet } from "react-native";

import CustomButton from "../../components/common/CustomButton";
import { colors } from "../../utils/colors";

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎓</Text>
      <Text style={styles.title}>Organiza tu vida académica</Text>
      <Text style={styles.subtitle}>
        Registra tus materias, controla tus tareas y recibe recordatorios antes de cada entrega.
      </Text>
      <CustomButton title="Comenzar" onPress={() => navigation.navigate("Auth")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: colors.background },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "700", color: colors.text, textAlign: "center" },
  subtitle: { marginTop: 10, marginBottom: 32, fontSize: 14, color: colors.textLight, textAlign: "center" },
});
