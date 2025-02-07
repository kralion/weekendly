import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Descubre Planes",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="matches"
        options={{
          title: "Match Perfil",
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
