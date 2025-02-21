import { useUser } from "@clerk/clerk-expo";
import { router, Stack } from "expo-router";
import { Plus } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function TabLayout() {
  const { user } = useUser();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerSearchBarOptions: {
            placeholder: "Buscar por categories o hobbies...",
          },
          headerRight: () => (
            <View className="flex-row items-center gap-4">
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full"
                onPress={() => router.push("/(screens)/plans/create")}
              >
                <Plus size={20} color="#A020F0" />
              </Button>
              <TouchableOpacity
                onPress={() => router.push("/(screens)/profile")}
              >
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
            </View>
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
