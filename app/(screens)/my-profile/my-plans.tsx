import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { Calendar, ChevronLeft, Plus } from "lucide-react-native";
import React from "react";
import { Alert, Image, TouchableOpacity, Vibration, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { usePlans } from "~/stores";
import { Plan } from "~/types";

export default function MyPlansScreen() {
  const [value, setValue] = React.useState("created");
  const [refreshing, setRefreshing] = React.useState(false);
  const { user } = useUser();
  const {
    userPlans,
    plans,
    fetchUserPlans,
    loading,
    getParticipants,
    participants,
    deletePlan,
  } = usePlans();

  const handleDeletePlan = React.useCallback(
    (planId: string) => {
      Vibration.vibrate();
      Alert.alert(
        "Eliminar plan",
        "¿Estás seguro de que deseas eliminar este plan?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => await deletePlan(planId),
          },
        ]
      );
    },
    [deletePlan]
  );

  // Get plans where user is joined
  const joinedPlans = React.useMemo(() => {
    return plans.filter(
      (plan) =>
        plan.participants.includes(user?.id || "") &&
        plan.creator_id !== user?.id
    );
  }, [plans, user?.id]);

  React.useEffect(() => {
    if (user?.id) {
      fetchUserPlans(user.id);
    }
  }, [user?.id]);

  // Fetch participants for each plan
  React.useEffect(() => {
    const fetchParticipantsForPlans = async () => {
      if (value === "created") {
        for (const plan of userPlans) {
          await getParticipants(plan.id || "");
        }
      } else {
        for (const plan of joinedPlans) {
          await getParticipants(plan.id || "");
        }
      }
    };

    fetchParticipantsForPlans();
  }, [value, userPlans, joinedPlans]);

  const onRefresh = React.useCallback(() => {
    if (user?.id) {
      setRefreshing(true);
      fetchUserPlans(user.id).finally(() => {
        setRefreshing(false);
      });
    }
  }, [user?.id]);

  const renderPlanCard = React.useCallback(
    ({ item, index }: { item: Plan; index: number }) => (
      <Animated.View key={item.id} entering={FadeInDown.delay(index * 100)}>
        <TouchableOpacity
          className="my-4 border border-border bg-muted rounded-xl shadow-sm overflow-hidden web:md:mx-auto"
          onLongPress={() => handleDeletePlan(item.id as string)}
          onPress={() => router.push(`/(screens)/plans/plan/${item.id}`)}
        >
          <Image
            source={{
              uri: item.image_url,
            }}
            className="w-full h-40 web:md:h-48"
          />
          <View className="p-4 web:md:p-5 flex-col gap-4">

            <Text className="text-xl font-semibold web:md:text-xl">
              {item.title}
            </Text>







            <View className="flex-row items-center">
              <Calendar size={18} color="gray" />
              <Text className="text-muted-foreground">   {new Date(item.date).toLocaleDateString()}</Text>
            </View>

          </View>
        </TouchableOpacity>
      </Animated.View>
    ),
    [participants, handleDeletePlan]
  );

  return (
    <View className="flex-1 bg-background pt-12 web:pt-4 web:md:mx-auto web:md:w-[650px]">
      {/* Header */}
      <View className="p-6 flex-row justify-between items-center bg-background  ">
        <Button
          className="rounded-full"
          onPress={() => router.back()}
          variant="secondary"
          size="icon"
        >
          <ChevronLeft color="#FF5733" size={24} />
        </Button>
        <Tabs
          value={value}
          onValueChange={setValue}
          className="flex-1 w-full max-w-[250px] mx-auto flex-col gap-1.5 web:md:w-full"
        >
          <TabsList className="flex-row w-full rounded-full  bg-muted">
            <TabsTrigger
              value="created"
              className="flex-1 rounded-full shadow-none"
            >
              <Text
                className={`${value === "created" ? "" : "text-muted-foreground"
                  } web:md:text-base`}
              >
                Creados
              </Text>
            </TabsTrigger>
            <TabsTrigger
              value="joined"
              className="flex-1 rounded-full shadow-none"
            >
              <Text
                className={`${value === "joined" ? "" : "text-muted-foreground"
                  } web:md:text-base`}
              >
                Unidos
              </Text>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          className="rounded-full"
          onPress={() => router.push("/(screens)/plans/create")}
          variant="secondary"
          size="icon"
        >
          <Plus color="#FF5733" size={24} />
        </Button>
      </View>

      {/* Content */}
      <Tabs
        value={value}
        onValueChange={setValue}
        className="flex-1 min-h-screen flex-col gap-1.5 px-4 "
      >
        <TabsContent value="created" className="flex-1">
          <FlashList
            data={userPlans}
            renderItem={renderPlanCard}
            contentContainerClassName="pb-48"
            showsVerticalScrollIndicator={false}
            estimatedItemSize={200}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center">
                <Image
                  source={{
                    uri: "https://img.icons8.com/?size=300&id=97CiUKVEgclT&format=png&color=000000",
                  }}
                  style={{
                    width: 100,
                    height: 100,
                  }}
                />
                <Text className="text-center text-muted-foreground mx-auto w-2/3 web:md:text-lg web:md:mt-4">
                  {loading
                    ? "Cargando tus planes..."
                    : "Aún no has creado ningún plan. ¡Crea uno nuevo!"}
                </Text>
              </View>
            }
          />
        </TabsContent>

        <TabsContent value="joined" className="flex-1">
          <FlashList
            data={joinedPlans}
            renderItem={renderPlanCard}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-48"
            estimatedItemSize={200}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <SafeAreaView className="flex-1  justify-center items-center ">
                <Image
                  source={{
                    uri: "https://img.icons8.com/?size=100&id=97CiUKVEgclT&format=png&color=000000",
                  }}
                  style={{
                    width: 100,
                    height: 100,
                  }}
                />
                <Text className="text-center text-muted-foreground mx-auto w-2/3 web:md:text-lg web:md:mt-4">
                  No te has unido a ningún plan aún
                </Text>
              </SafeAreaView>
            }
          />
        </TabsContent>
      </Tabs>
    </View>
  );
}
