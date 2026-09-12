import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { View, ActivityIndicator } from "react-native";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3F51B5" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <RootNavigator />
            </NavigationContainer>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
