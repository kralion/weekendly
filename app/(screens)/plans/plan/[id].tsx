import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import * as React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { MapPin, Calendar, Users, ArrowLeft } from "lucide-react-native";
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
        <View className="relative" style={{ height: 400 }}>
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

          <Button
            variant="ghost"
            className="absolute top-4 left-4 rounded-full bg-black/20"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </Button>
        </View>

        <View className="px-4 mt-4">
          <Text className="text-3xl font-bold mb-2">{plan.title}</Text>

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

          <View className="flex-row justify-between mb-6">
            <View className="flex-row items-center">
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

          <Button className="mb-6" onPress={() => setShowConfirmed(true)}>
            <Text className="text-white font-semibold">Unirme al plan</Text>
          </Button>
        </View>
      </ScrollView>

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
