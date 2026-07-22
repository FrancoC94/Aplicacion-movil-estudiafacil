import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../hooks/useAuth";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";
import SplashScreen from "../screens/auth/SplashScreen";
import OnboardingScreen from "../screens/onboarding/OnboardingScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
}
