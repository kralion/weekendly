import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Calendar, ChevronLeft, MapPin } from "lucide-react-native";
import * as React from "react";
import {
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { usePlans } from "~/stores";
import type { Plan } from "~/types";

function PlanCard({ plan }: { plan: Plan }) {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return (
    <Pressable
      onPress={() => router.push(`/(screens)/plans/plan/${plan.id}`)}
      className="relative"
      style={{ height: SCREEN_HEIGHT, width: "100%" }}
    >
      <View className="p-4 flex-row mt-10 justify-between items-center absolute top-0 left-0 right-0 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
        >
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Image
        source={{
          uri: plan.image_url,
        }}
        contentFit="cover"
        style={{ width: "100%", height: "100%" }}
        className="absolute web:md:object-cover"
      />

      <LinearGradient
        colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,1)"]}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />

      {/* Main Content */}
      <View className="absolute bottom-4 left-0 right-0 p-6 web:md:max-w-2xl web:md:mx-auto">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-3xl font-bold text-white web:md:text-4xl">
            {plan.title}
          </Text>
        </View>

        {/* Date and Location */}
        <View className="flex flex-col gap-2 mb-4">
          <View className="flex-row items-center gap-2">
            <Calendar size={20} color="white" className="mr-2" />
            <Text className="text-white text-base web:md:text-lg">
              {formatDate(plan.date)}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <MapPin size={20} color="white" className="mr-2" />
            <Text className="text-white text-base web:md:text-lg">
              {plan.location}
            </Text>
            <Text className="text-white/60 text-sm ml-2 web:md:text-base">
              (2.5 km)
            </Text>
          </View>
        </View>

        {/* Participants */}
        <View className="flex-row items-center mb-4">
          <View className="flex-row -space-x-2 mr-3">
            {plan.participants.map((participant, i) => (
              <Avatar alt="Participant" key={i}>
                <AvatarImage
                  source={{ uri: `https://i.pravatar.cc/150?img=${i + 1}` }}
                />
              </Avatar>
            ))}
          </View>
          <Text className="text-white text-base web:md:text-lg">
            {plan.participants.length}/{plan.max_participants} participantes
          </Text>
        </View>

        {/* Tags */}
        <View className="flex-row flex-wrap gap-2 mb-6">
          {["Música", "Fotografía", "Arte"].map((interest, index) => (
            <View key={index} className="bg-white/20 px-4 py-2 rounded-full">
              <Text className="text-white web:md:text-base">{interest}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}

        <Button
          className="flex-1 rounded-full web:md:max-w-xs web:md:self-center"
          size="lg"
          onPress={() => router.push(`/(screens)/plans/plan/${plan.id}`)}
        >
          <Text className="text-base font-medium">Ver Detalles</Text>
        </Button>
      </View>
    </Pressable>
  );
}

export default function Plans() {
  const { filteredPlans, loading: plansLoading, fetchPlans } = usePlans();
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  React.useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <FlashList
        estimatedItemSize={SCREEN_HEIGHT}
        data={filteredPlans}
        renderItem={({ item }) => <PlanCard plan={item} />}
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        pagingEnabled
        getItemType={(item) => "plan"}
      />
    </View>
  );
}
