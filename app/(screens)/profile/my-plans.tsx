import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { ChevronLeft, Plus } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";

export default function MyPlansScreen() {
  const [value, setValue] = React.useState("created");
  const [refreshing, setRefreshing] = React.useState(false);

  // TODO: Replace with actual data fetching
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderPlanCard = React.useCallback(
    ({ item }: { item: number }) => (
      <TouchableOpacity
        className="my-4 bg-white rounded-xl shadow-sm overflow-hidden"
        onPress={() => router.push(`/(screens)/plans/plan/${item}`)}
      >
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
          }}
          className="w-full h-40"
        />
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold">Plan de ejemplo</Text>
            <View className="bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-blue-800 text-sm">12/12/2023</Text>
            </View>
          </View>

          <Text className="text-gray-600 mb-3">
            Una breve descripción del plan y las actividades que se
            realizarán...
          </Text>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="flex-row -space-x-2">
                {[1, 2, 3].map((_, i) => (
                  <View
                    key={i}
                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                  />
                ))}
              </View>
              <Text className="text-gray-600 ml-2">3 participantes</Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <Text className="text-gray-600">Activo</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    []
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
          <ChevronLeft size={24} />
        </Button>

        <Text className="text-xl font-semibold ml-2">Mis Planes</Text>
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full"
          onPress={() => router.push("/(screens)/plans/create")}
        >
          <Plus size={20} color="#A020F0" />
        </Button>
      </View>

      <Tabs
        value={value}
        onValueChange={setValue}
        className="flex-1 w-full  max-w-[350px]  mx-auto flex-col gap-1.5"
      >
        <TabsList className="flex-row w-full rounded-lg   mb-4 border border-gray-200 bg-white">
          <TabsTrigger
            value="created"
            className="flex-1 rounded-md shadow-none"
          >
            <Text>Creados</Text>
          </TabsTrigger>
          <TabsTrigger value="joined" className="flex-1 rounded-md shadow-none">
            <Text>Participando</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="created" className="flex-1">
          <FlashList
            data={[1, 2, 3, 4, 5]}
            renderItem={renderPlanCard}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="px-4 pb-4"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </TabsContent>

        <TabsContent value="joined" className="flex-1">
          <FlashList
            data={[6, 7, 8]}
            renderItem={renderPlanCard}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={200}
            contentContainerClassName="px-4 pb-4"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </TabsContent>
      </Tabs>
    </View>
  );
}
