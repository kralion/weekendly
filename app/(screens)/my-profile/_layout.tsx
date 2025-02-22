import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";

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
        name="matches"
        options={{
          title: "Match Perfil",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Editar preferencias",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="my-plans"
        options={{
          title: "Mis Planes",
        }}
      />
    </Stack>
  );
}
