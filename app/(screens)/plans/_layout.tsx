import { Stack } from "expo-router";
import React from "react";

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
          title: "Perfil",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
