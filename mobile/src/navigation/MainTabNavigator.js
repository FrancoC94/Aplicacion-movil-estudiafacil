import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import HomeScreen from "../screens/main/HomeScreen";
import MateriasScreen from "../screens/main/MateriasScreen";
import TareasScreen from "../screens/main/TareasScreen";
import CalendarioScreen from "../screens/main/CalendarioScreen";
import ProgresoScreen from "../screens/main/ProgresoScreen";
import PerfilScreen from "../screens/main/PerfilScreen";
import HeaderRight from "./HeaderRight";
import { colors } from "../utils/colors";

const Tab = createBottomTabNavigator();

const ICONS = {
  Inicio: "🏠",
  Materias: "📚",
  Tareas: "📋",
  Calendario: "📅",
  Progreso: "📊",
  Perfil: "👤",
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => <HeaderRight />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{ICONS[route.name]}</Text>,
        tabBarLabelStyle: {
          fontFamily: "Poppins_500Medium",
          fontSize: 10,
        },
        headerTitleStyle: {
          fontFamily: "Poppins_600SemiBold",
          fontSize: 18,
          color: colors.onSurface,
        },
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Materias" component={MateriasScreen} />
      <Tab.Screen name="Tareas" component={TareasScreen} />
      <Tab.Screen name="Calendario" component={CalendarioScreen} />
      <Tab.Screen name="Progreso" component={ProgresoScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
