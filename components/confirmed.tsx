import { Image } from "expo-image";
import { View } from "react-native";
import { Text } from "./ui/text";
import { Button } from "./ui/button";
import { BlurView } from "expo-blur";
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";
import { router } from "expo-router";
import { Link2Icon } from "lucide-react-native";

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
      <View className="bg-white rounded-3xl w-full p-6 h-1/2 items-center">
        <View className="flex-row items-center justify-center mb-6">
          <Animated.View entering={FadeInLeft.duration(250).delay(150)}>
            <View className="relative -right-4">
              <Image
                source={{ uri: planImage }}
                style={{ width: 100, height: 100, borderRadius: 999 }}
              />
            </View>
          </Animated.View>
          <Animated.View entering={FadeInRight.duration(250).delay(150)}>
            <View className="relative -left-4">
              <Image
                source={{ uri: userImage }}
                style={{ width: 100, height: 100, borderRadius: 999 }}
              />
            </View>
          </Animated.View>
        </View>

        <View className="items-center  mb-10">
          <Image
            source={{
              uri: "https://img.icons8.com/?size=300&id=IBUUC7KokVgW&format=png&color=000000",
            }}
            style={{ width: 100, height: 100 }}
          />
          <Text className="text-2xl font-bold mb-2">¡Te has unido!</Text>

          <Text className="text-gray-500 text-center">
            Tienes {hoursToRespond} horas para coordinar los detalles del plan
          </Text>
        </View>

        <Button
          className="w-full  rounded-full"
          size="lg"
          onPress={() => {
            // Handle chat navigation
            router.back();
          }}
        >
          <Text className="text-white font-semibold">Cerrar</Text>
        </Button>
      </View>
    </BlurView>
  );
}
