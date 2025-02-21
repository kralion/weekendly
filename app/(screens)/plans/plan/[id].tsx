import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import * as React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import {
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  ChevronLeft,
  Share,
} from "lucide-react-native";
import { usePlans } from "~/stores";
import { LinearGradient } from "expo-linear-gradient";
import { Confirmed } from "~/components/confirmed";

export default function PlanDetail() {
  const { id } = useLocalSearchParams();
  const { plans } = usePlans();
  const plan = plans.find((p) => p.id === id);
  const [showConfirmed, setShowConfirmed] = React.useState(false);

  if (!plan) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Plan no encontrado</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView>
        <View className="relative " style={{ height: 400 }}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1513689125086-6c432170e843",
            }}
            style={{ width: "100%", height: "100%" }}
            className="absolute"
          />

          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,0.8)"]}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />

          <View className="p-4 flex-row mt-10 justify-between items-center absolute top-0 left-0 right-0 z-10">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
            >
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 mt-4">
          <View className="flex flex-row justify-between items-center">
            <Text className="text-3xl font-bold mb-2">{plan.title}</Text>
            <Button size="icon" className="rounded-full" variant="ghost">
              <Share size={20} color="black" />
            </Button>
          </View>

          <View className="flex-row items-center mb-4">
            <MapPin size={16} className="mr-1" />
            <Text className="text-sm">{plan.location}</Text>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-6">
            {["Música", "Fotografía", "Arte"].map((interest, index) => (
              <View
                key={index}
                className="bg-primary/10 px-3 py-1 rounded-full"
              >
                <Text className="text-sm text-primary">{interest}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row justify-between mb-6 items-center">
            <View className="flex-row items-center gap-2">
              <Calendar size={16} className="mr-2" />
              <Text>
                {new Date(plan.date).toLocaleDateString("es", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Users size={16} className="mr-2" />
              <Text>
                {plan.participants.length}/{plan.max_participants}
              </Text>
            </View>
          </View>

          <Text className="text-lg font-semibold mb-2">Descripción</Text>
          <Text className="text-gray-600 mb-6">{plan.description}</Text>
        </View>
      </ScrollView>
      <Button
        size="lg"
        className="m-4 mb-8 rounded-full"
        onPress={() => setShowConfirmed(true)}
      >
        <Text className="text-white font-semibold">Unirme al plan</Text>
      </Button>

      {showConfirmed && (
        <Confirmed
          planTitle={plan.title}
          planImage="https://images.unsplash.com/photo-1513689125086-6c432170e843"
          userImage="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
          onClose={() => setShowConfirmed(false)}
        />
      )}
    </View>
  );
}
