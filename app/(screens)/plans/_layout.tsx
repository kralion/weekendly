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
    </Stack>
  );
}
