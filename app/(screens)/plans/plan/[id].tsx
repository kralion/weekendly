import { useUser } from "@clerk/clerk-expo";
import { Audio } from "expo-av";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  Calendar,
  ChevronLeft,
  MapPin,
  Pen,
  Share2,
  Users,
} from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  Share,
  TouchableOpacity,
  View,
  Vibration,
} from "react-native";
import { toast } from "sonner-native";
import { Confirmed } from "~/components/confirmed";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { usePlans } from "~/stores";

//DOCS:  npx expo start --https when executing on the web
export default function PlanDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useUser();
  const { plans, joinPlan, leavePlan } = usePlans();

  const plan = plans.find((p) => p.id === id);
  const [showConfirmed, setShowConfirmed] = React.useState(false);
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playFeedback = async () => {
    // Play sound and vibrate simultaneously
    Vibration.vibrate(50);
    const { sound } = await Audio.Sound.createAsync(
      require("../../../../assets/sounds/success.mp3"),
      { volume: 0.5 }
    );
    setSound(sound);
    await sound.playAsync();
  };

  async function handleJoinPlan() {
    if (!plan || !user) return;
    await playFeedback();
    joinPlan(plan.id as string, user?.id);
    setShowConfirmed(true);
  }

  async function handleLeavePlan() {
    if (!plan || !user) return;
    await playFeedback();
    leavePlan(plan.id as string, user?.id);
    setShowConfirmed(true);
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };
    return date.toLocaleDateString("es-ES", options);
  };

  const handleShare = async () => {
    if (!plan) return;

    try {
      // Create a deep link URL for the plan
      const deepLink = `exp://192.168.100.6:8081/--/plans/${plan.id}`;

      const message = `¡Únete a mi plan "${plan.title}"!\n\n📍 ${
        plan.location
      }\n📅 ${formatDate(new Date(plan.date))}\n\n${
        plan.description
      }\n\nParticipantes: ${plan.participants.length}/${
        plan.max_participants
      }\n\nAbrir plan: ${deepLink}`;

      await Share.share({
        message,
        title: "Compartir Plan",
        url: deepLink,
      });
    } catch (error) {
      toast.error("Error al compartir el plan");
      console.error(error);
    }
  };

  if (!plan) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Plan no encontrado</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerClassName="pb-10">
        <View className="relative " style={{ height: 400 }}>
          <Image
            source={{
              uri: plan.image_url,
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
            {user?.id === plan.creator_id && (
              <TouchableOpacity
                onPress={() =>
                  router.push(`/(screens)/plans/create?id=${plan.id}`)
                }
                className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
              >
                <Pen size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="px-4 mt-4">
          <View className="flex flex-row justify-between items-center ">
            <Text className="text-3xl font-bold mb-2">{plan.title}</Text>
            <Button
              size="icon"
              className="rounded-full"
              variant="secondary"
              onPress={handleShare}
            >
              <Share2 size={20} color="#A020F0" />
            </Button>
          </View>

          <View className="flex-row items-center mb-4 gap-1">
            <MapPin size={16} className="mr-1" color="#A020F0" />
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
              <Calendar size={16} className="mr-2" color="#A020F0" />
              <Text>
                {new Date(plan.date).toLocaleDateString("es", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Users size={16} className="mr-2" color="#A020F0" />
              <Text>
                {plan.participants.length}/{plan.max_participants}
              </Text>
            </View>
          </View>

          <Text className="text-lg font-semibold mb-2">Descripción</Text>
          <Text className="text-gray-600 mb-6">{plan.description}</Text>
        </View>
        {user?.id !== plan.creator_id && (
          <View className="flex-row items-center gap-1  p-4">
            <Text className="  text-sm text-muted-foreground">Creado por</Text>
            <Link href={`/(screens)/plans/profile/${plan.creator_id}`}>
              <Text className="text-sm font-semibold text-brand">
                @{plan.profiles?.username}
              </Text>
            </Link>
          </View>
        )}
        {user?.id === plan.participants.find((id) => id === user?.id) &&
          user?.id !== plan.creator_id && (
            <Button size="lg" className=" rounded-full m-4">
              <Text className="text-white font-semibold">Salir del Plan</Text>
            </Button>
          )}
      </ScrollView>
      {user?.id !== plan.participants.find((id) => id === user?.id) &&
        user?.id !== plan.creator_id && (
          <Button
            size="lg"
            className="m-4 mb-8 rounded-full"
            onPress={handleJoinPlan}
          >
            <Text className="text-white font-semibold">Unirme al plan</Text>
          </Button>
        )}
      {user?.id === plan.participants.find((id) => id === user?.id) &&
        user?.id !== plan.creator_id && (
          <Button
            size="lg"
            className="m-4 mb-8 rounded-full"
            onPress={handleLeavePlan}
          >
            <Text className="text-white font-semibold">Salir del plan</Text>
          </Button>
        )}

      {showConfirmed && (
        <Confirmed
          planTitle={plan.title}
          planImage="https://images.unsplash.com/photo-1513689125086-6c432170e843"
          userImage={user?.imageUrl as string}
          onClose={() => setShowConfirmed(false)}
        />
      )}
    </View>
  );
}
