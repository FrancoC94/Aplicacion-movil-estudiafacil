import React from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";

import { colors } from "../../utils/colors";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.title}>EstudiaFácil</Text>
      <Text style={styles.subtitle}>ORGANIZACIÓN ACADÉMICA</Text>
      <Text style={styles.university}>Universidad Estatal Amazónica</Text>

      <ActivityIndicator size="small" color="#fff" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F172A",
    padding: 24,
  },
  logoWrapper: {
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  logo: { width: 140, height: 140, borderRadius: 32 },
  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#38BDF8",
    letterSpacing: 2,
  },
  university: {
    marginTop: 8,
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  loader: {
    marginTop: 36,
  },
});
