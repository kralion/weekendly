import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { MapPin } from "lucide-react-native";
import { useCategories, usePlans } from "~/stores";
import type { Category, Plan } from "~/types";
import { LinearGradient } from "expo-linear-gradient";

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Pressable
      style={{ width: 280, height: 400 }}
      className="ml-4 bg-white rounded-3xl overflow-hidden relative"
      onPress={() => router.push("/(screens)/plans")}
    >
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1513689125086-6c432170e843",
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
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-2xl font-bold text-white">{plan.title}</Text>
          <Text className="text-lg font-semibold text-white">27</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <MapPin size={16} color="white" className="mr-1" />
          <Text className="text-white text-sm">{plan.location}</Text>
        </View>

        <View className="flex-row flex-wrap gap-2 mb-3">
          {["Música", "Fotografía", "Arte"].map((interest, index) => (
            <View key={index} className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-sm">{interest}</Text>
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
  );
}

export default function Home() {
  const { plans, loading: plansLoading, fetchPlans } = usePlans();
  const {
    categories,
    loading: categoriesLoading,
    fetchCategories,
  } = useCategories();

  React.useEffect(() => {
    fetchPlans();
    fetchCategories();
  }, []);

  // Sort plans alphabetically
  const sortedPlans = React.useMemo(() => {
    return [...plans].sort((a, b) => a.title.localeCompare(b.title));
  }, [plans]);

  if (plansLoading || categoriesLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 bg-background"
      >
        <Text className="text-lg font-bold mb-2 px-4">Categorías</Text>
        <FlashList
          estimatedItemSize={75}
          data={categories}
          renderItem={({ item }) => (
            <Button>
              <Text className="mt-8 text-white">{item.name}</Text>
            </Button>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        />

        <Text className="text-lg font-bold mt-4 mb-2 px-4">
          Planes disponibles
        </Text>
        <FlashList
          estimatedItemSize={75}
          data={sortedPlans}
          renderItem={({ item }) => <PlanCard plan={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
}
