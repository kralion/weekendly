import { useUser } from "@clerk/clerk-expo";
import BottomSheet from "@gorhom/bottom-sheet";
import { Audio } from "expo-av";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  Flag,
  MapPin,
  Pen,
  Share2,
  UserPlus,
  Users,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Share,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { toast } from "sonner-native";
import AddComment from "~/components/AddComment";
import { Confirmed } from "~/components/confirmed";
import InviteBottomSheet from "~/components/Invite";
import ReportPlan from "~/components/ReportPlan";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { capitalize } from "~/lib/utils";
import { usePlans } from "~/stores";
import { useComments } from "~/stores/comments";
import { Plan } from "~/types";

//DOCS:  npx expo start --https when executing on the web
export default function PlanDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useUser();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const commentSheetRef = React.useRef<BottomSheet>(null);
  const reportSheetRef = React.useRef<BottomSheet>(null);

  const [plan, setPlan] = React.useState<Plan | null>(null);
  const { joinPlan, leavePlan, getPlanById } = usePlans();
  const { comments, getCommentsByPlanId } = useComments();

  useEffect(() => {
    if (id) {
      getPlanById(id as string).then(setPlan);
      getCommentsByPlanId(id as string);
    }
  }, [id]);

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
    router.back();
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
        <ActivityIndicator size="large" color="#FF5733" />
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
            <Text className="text-2xl font-bold mb-2">{plan.title}</Text>
            <View className="flex flex-row items-center">
              <Button
                size="icon"
                className="rounded-full"
                variant="ghost"
                onPress={() => bottomSheetRef.current?.expand()}
              >
                <UserPlus size={20} color="#FF5733" />
              </Button>
              <Button
                size="icon"
                className="rounded-full"
                variant="ghost"
                onPress={handleShare}
              >
                <Share2 size={20} color="#FF5733" />
              </Button>
              <Button
                size="icon"
                className="rounded-full"
                variant="ghost"
                onPress={() => reportSheetRef.current?.expand()}
              >
                <Flag size={20} color="#FF5733" />
              </Button>
            </View>
          </View>

          {(plan.reports || 0) > 10 && (
            <View className="bg-destructive/10 p-4 rounded-lg mb-4 flex-row items-center gap-2">
              <AlertTriangle size={20} color="#FF5733" />
              <Text className="text-sm text-destructive flex-1">
                Este plan ha sido reportado múltiples veces. Te recomendamos ser
                precavido antes de unirte.
              </Text>
            </View>
          )}

          <View className="flex-row items-center mb-4 gap-1">
            <MapPin size={16} className="mr-1" color="#FF5733" />
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
              <Calendar size={16} className="mr-2" color="#FF5733" />
              <Text>
                {capitalize(
                  new Date(plan.date).toLocaleDateString("es", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                )}{" "}
                -{" "}
                {new Date(plan.date)
                  .toLocaleTimeString("es", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })
                  .toUpperCase()}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Users size={16} className="mr-2" color="#FF5733" />
              <Text>
                {plan.participants.length}/{plan.max_participants}
              </Text>
            </View>
          </View>

          <Text className="text-lg font-semibold mb-2">Descripción</Text>
          <Text className="text-gray-600 mb-6">{plan.description}</Text>
        </View>
        {user?.id !== plan.creator_id && (
          <View className="flex-row items-center gap-1  px-4">
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
            <Button
              size="lg"
              className=" rounded-full m-4"
              onPress={handleLeavePlan}
            >
              <Text className="text-white font-semibold">Salir del Plan</Text>
            </Button>
          )}

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

        <View className="mt-6 px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Comentarios</Text>
            <TouchableOpacity onPress={() => commentSheetRef.current?.expand()}>
              <Text className=" text-primary">Comentar</Text>
            </TouchableOpacity>
          </View>

          {comments.length > 0 ? (
            <View className="flex flex-col gap-4">
              {comments.map((comment) => (
                <View
                  className="flex-row items-center gap-2 mb-2"
                  key={comment.id}
                >
                  <Image
                    source={{
                      uri: comment.profiles?.image_url,
                    }}
                    className="rounded-full"
                    style={{ width: 40, height: 40 }}
                  />
                  <View className="flex flex-col">
                    <View className="flex flex-row gap-2 items-center">
                      <Text className="font-medium text-muted-foreground">
                        {comment.profiles?.username}
                      </Text>
                      <Text className="text-sm">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text className="font-medium">{comment.message}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-muted p-4 rounded-lg">
              <Text className="text-center text-muted-foreground">
                No hay comentarios aún
              </Text>
            </View>
          )}
        </View>

        {showConfirmed && (
          <Confirmed
            planTitle={plan.title}
            planImage={plan.image_url}
            userImage={user?.imageUrl as string}
            onClose={() => {
              setShowConfirmed(false);
              router.back();
            }}
            creatorPhone={plan.profiles?.phone}
          />
        )}
        <InviteBottomSheet bottomSheetRef={bottomSheetRef} id={id as string} />
        <AddComment
          planId={id as string}
          userId={user?.id as string}
          bottomSheetRef={commentSheetRef}
        />
        <ReportPlan planId={id as string} bottomSheetRef={reportSheetRef} />
      </ScrollView>
    </View>
  );
}
