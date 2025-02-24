import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Linking, Pressable, View } from "react-native";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

interface ConfirmedProps {
  planTitle: string;
  planImage: string;
  userImage: string;
  hoursToRespond?: number;
  onClose?: () => void;
  creatorPhone: string | null | undefined;
}

export function Confirmed({
  planTitle,
  planImage,
  userImage,
  hoursToRespond = 36,
  onClose,
  creatorPhone,
}: ConfirmedProps) {
  return (
    <Pressable className="absolute inset-0 z-50" onPress={onClose}>
      <BlurView
        intensity={90}
        className="flex-1 justify-center items-center px-4 bg-black/50"
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-white rounded-3xl w-full max-w-sm overflow-hidden p-6  items-center">
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
                Tienes {hoursToRespond} horas para coordinar los detalles del
                plan
              </Text>
            </View>

            <Button
              className="rounded-full bg-[#25D366] flex-row items-center gap-2 w-full"
              size="lg"
              onPress={() =>
                //TODO: Internationalization to this link
                Linking.openURL(
                  `https://wa.me/+51${creatorPhone}?text=Hola que tal`
                )
              }
            >
              <Image
                source={{
                  uri: "https://img.icons8.com/?size=100&id=85088&format=png&color=FFFFFF",
                }}
                style={{ width: 20, height: 20 }}
              />
              <Text className="text-white"> Hablar por Whatsapp </Text>
            </Button>
          </View>
        </Pressable>
      </BlurView>
    </Pressable>
  );
}
