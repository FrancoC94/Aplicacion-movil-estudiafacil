import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import CustomButton from "../../components/common/CustomButton";
import { colors } from "../../utils/colors";

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>Organiza tu vida académica</Text>
      <Text style={styles.subtitle}>
        Registra tus materias, controla tus tareas y recibe recordatorios antes de cada entrega.
      </Text>
      <View style={styles.buttonWrapper}>
        <CustomButton title="Comenzar" onPress={() => navigation.navigate("Auth")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  logoWrapper: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  logo: { width: 120, height: 120, borderRadius: 28 },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, textAlign: "center" },
  subtitle: {
    marginTop: 12,
    marginBottom: 36,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textLight,
    textAlign: "center",
  },
  buttonWrapper: { width: "100%" },
});
