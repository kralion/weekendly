import { router, Stack } from "expo-router";
import { X } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Button } from "~/components/ui/button";

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Descubre Planes",
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "Crear Plan",
        }}
      />
      <Stack.Screen
        name="plan/[id]"
        options={{
          title: "Plan",
        }}
      />
      <Stack.Screen
        name="profile/[id]"
        options={{
          title: "Perfil del Creador",
          presentation: "modal",
          headerShadowVisible: false,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
