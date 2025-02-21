import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as React from "react";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { MapPin } from "lucide-react-native";
import { usePlans } from "~/stores";
import type { Plan } from "~/types";
import { LinearGradient } from "expo-linear-gradient";

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Pressable
      onPress={() => router.push(`/(screens)/plans/plan/${plan.id}`)}
      className="mb-4 bg-white relative"
      style={{ height: 500 }}
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

export default function Plans() {
  const { plans, loading: plansLoading, fetchPlans } = usePlans();
  const [page, setPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;

  React.useEffect(() => {
    fetchPlans();
  }, []);

  // Sort plans alphabetically
  const sortedPlans = React.useMemo(() => {
    return [...plans].sort((a, b) => a.title.localeCompare(b.title));
  }, [plans]);

  const handleLoadMore = React.useCallback(() => {
    if (page * ITEMS_PER_PAGE < sortedPlans.length) {
      setPage((prev) => prev + 1);
    }
  }, [page, sortedPlans.length]);

  if (plansLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} className="bg-background px-4">
      <FlashList
        estimatedItemSize={500}
        data={sortedPlans.slice(0, page * ITEMS_PER_PAGE)}
        renderItem={({ item }) => <PlanCard plan={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
