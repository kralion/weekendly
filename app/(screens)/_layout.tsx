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
        name="notifications"
        options={{
          title: "Notificaciones",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          title: "Buscar",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
