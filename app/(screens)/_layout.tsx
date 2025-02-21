import { useUser } from "@clerk/clerk-expo";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";

export default function TabLayout() {
  const { user } = useUser();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Descubre Planes",
          headerShown: true,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerSearchBarOptions: {
            placeholder: "Buscar por categories o hobbies...",
          },
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/(screens)/profile")}>
              <Avatar
                alt="User"
                style={{
                  width: 30,
                  height: 30,
                }}
              >
                <AvatarImage
                  source={{
                    uri: user?.imageUrl,
                  }}
                />
                <AvatarFallback>
                  <Text>FN</Text>
                </AvatarFallback>
              </Avatar>
            </TouchableOpacity>
          ),
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
    </Stack>
  );
}
