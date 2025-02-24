import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { ChevronLeft, Plus } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
  } = usePlans();

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
    ({ item }: { item: Plan }) => (
      <TouchableOpacity
        className="my-4 bg-white rounded-xl shadow-sm overflow-hidden"
        onPress={() => router.push(`/(screens)/plans/plan/${item.id}`)}
      >
        <Image
          source={{
            uri: item.image_url,
          }}
          className="w-full h-40"
        />
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold">{item.title}</Text>
            <View className="bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-blue-800 text-sm">
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <Text className="text-gray-600 mb-3" numberOfLines={2}>
            {item.description}
          </Text>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="flex-row -space-x-2">
                {participants.slice(0, 3).map((participant, index) => (
                  <Avatar key={index} alt={participant.username}>
                    <AvatarImage
                      source={{ uri: participant.image_url as string }}
                    />
                    <AvatarFallback>
                      <Text>{participant.username?.[0]}</Text>
                    </AvatarFallback>
                  </Avatar>
                ))}
              </View>
              <Text className="text-gray-600 ml-2">
                {item.participants.length} personas
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <Text className="text-gray-600">Activo</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [participants]
  );

  return (
    <View className="flex-1 bg-background pt-12">
      {/* Header */}
      <View className="p-6 flex-row justify-between items-center bg-background">
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
          className="flex-1 w-full  max-w-[250px]  mx-auto flex-col gap-1.5"
        >
          <TabsList className="flex-row w-full rounded-full border border-gray-200 bg-white">
            <TabsTrigger
              value="created"
              className="flex-1 rounded-full shadow-none"
            >
              <Text
                className={`${
                  value === "created" ? "text-black" : "text-zinc-400"
                }`}
              >
                Creados
              </Text>
            </TabsTrigger>
            <TabsTrigger
              value="joined"
              className="flex-1 rounded-full shadow-none"
            >
              <Text
                className={`${
                  value === "joined" ? "text-black" : "text-zinc-400"
                }`}
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
        className="flex-1 min-h-screen flex-col gap-1.5 px-4"
      >
        <TabsContent value="created" className="flex-1">
          <FlashList
            data={userPlans}
            renderItem={renderPlanCard}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={200}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View className="flex-1 mt-16 justify-center items-center">
                <Image
                  source={{
                    uri: "https://img.icons8.com/?size=200&id=p7WlmbKvtsHM&format=png&color=000000",
                  }}
                  style={{ width: 100, height: 100 }}
                />
                <Text className="text-center text-muted-foreground mx-auto w-2/3">
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
            estimatedItemSize={200}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View className="flex-1 mt-16 justify-center items-center">
                <Image
                  source={{
                    uri: "https://img.icons8.com/?size=200&id=p7WlmbKvtsHM&format=png&color=000000",
                  }}
                  style={{ width: 100, height: 100 }}
                />
                <Text className="text-center text-muted-foreground mx-auto w-2/3">
                  No te has unido a ningún plan aún
                </Text>
              </View>
            }
          />
        </TabsContent>
      </Tabs>
    </View>
  );
}
