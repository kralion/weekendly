import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import { Pressable, useWindowDimensions, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Plan } from "~/types";
import { Text } from "./ui/text";

export function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const { height } = useWindowDimensions();
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .springify()
        .mass(0.5)
        .damping(8)
        .stiffness(80)}
      className="px-4"
    >
      <Pressable
        style={{ height: height * 0.5 }}
        className=" bg-white rounded-3xl overflow-hidden relative"
        onPress={() => router.push("/(screens)/plans")}
      >
        <Image
          source={{
            uri: plan.image_url,
          }}
          style={{ width: "100%", height: "100%" }}
          className="absolute"
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 200,
          }}
        />

        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Text className="text-2xl font-bold mb-2 text-white">
            {plan.title}
          </Text>

          <View className="flex-row items-center mb-2 gap-1">
            <MapPin size={16} color="white" className="mr-1" />
            <Text className="text-white text-sm">{plan.location}</Text>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-3">
            {plan.categories.map((category, index) => (
              <View key={index} className="bg-white/20 px-3 py-1 rounded-full">
                <Text className="text-white text-sm">{category}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-white text-sm">
              {plan.participants.length}/{plan.max_participants} participantes
            </Text>
            <Text className="text-white text-sm">
              {new Date(plan.date).toLocaleDateString("es", {
                weekday: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
