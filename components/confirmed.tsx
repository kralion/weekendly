import { Image } from "expo-image";
import { View } from "react-native";
import { Text } from "./ui/text";
import { Button } from "./ui/button";
import { MessageCircle, X } from "lucide-react-native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

interface ConfirmedProps {
  planTitle: string;
  planImage: string;
  userImage: string;
  hoursToRespond?: number;
  onClose?: () => void;
}

export function Confirmed({
  planTitle,
  planImage,
  userImage,
  hoursToRespond = 36,
  onClose,
}: ConfirmedProps) {
  return (
    <BlurView
      intensity={90}
      tint="light"
      className="absolute inset-0 items-center justify-center px-8"
    >
      <View className="bg-white rounded-3xl w-full p-6 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onPress={onClose}
        >
          <X size={24} />
        </Button>

        <View className="flex-row items-center justify-center mb-6">
          <View className="relative -right-4">
            <Image
              source={{ uri: planImage }}
              style={{ width: 120, height: 160 }}
              className="rounded-2xl"
            />
          </View>
          <View className="relative -left-4">
            <Image
              source={{ uri: userImage }}
              style={{ width: 120, height: 160 }}
              className="rounded-2xl"
            />
          </View>
        </View>

        <View className="items-center mb-6">
          <View className="bg-blue-50 rounded-full p-2 mb-4">
            <View className="bg-blue-500 rounded-full p-3">
              <View className="bg-white rounded-full p-1">
                <View className="bg-blue-500 rounded-full w-4 h-4" />
              </View>
            </View>
          </View>
          <Text className="text-2xl font-bold mb-2">¡Te has unido!</Text>
          <Text className="text-gray-500 text-center">
            Tienes {hoursToRespond} horas para coordinar los detalles del plan
          </Text>
        </View>

        {/* <Button
          className="w-full mb-4"
          onPress={() => {
            // Handle chat navigation
            router.push("/(screens)/chat");
          }}
        >
          <MessageCircle className="mr-2" color="white" size={20} />
          <Text className="text-white font-semibold">Iniciar chat</Text>
        </Button> */}
      </View>
    </BlurView>
  );
}
