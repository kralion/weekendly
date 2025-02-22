import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Descubre Planes",
        }}
      />
      <Stack.Screen
        name="match-profile"
        options={{
          title: "Match Perfil",
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerBackTitle: "Atrás",
          presentation: "modal",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notificaciones",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
