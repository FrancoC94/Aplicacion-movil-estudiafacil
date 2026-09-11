import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeContext } from "../../context/ThemeContext";

export default function OfflineBanner({ visible, lastSync }) {
  const { theme } = useThemeContext();
  if (!visible) return null;

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return "nunca";
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return `hace ${seconds} seg`;
    const minutes = Math.floor(seconds / 60);
    return `hace ${minutes} min`;
  };

  const isDark = theme.isDark;

  return (
    <View style={[
        styles.container,
        {
            backgroundColor: isDark ? "#332B00" : "#FFF3CD",
            borderBottomColor: isDark ? "#4D4100" : "#FFEEBA"
        }
    ]}>
      <Text style={[styles.text, { color: isDark ? "#FFE082" : "#856404" }]}>
        ⚠️ Modo offline | Sincronizado {getTimeAgo(lastSync)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
