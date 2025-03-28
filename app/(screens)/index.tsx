import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Bell, BellDot, Search } from "lucide-react-native";
import * as React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { PlanCard } from "~/components/PlanCard";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { usePlans, useProfiles, useSearch } from "~/stores";

const CATEGORIES = [
  { id: "1", name: "Música" },
  { id: "2", name: "Arte" },
  { id: "3", name: "Deportes" },
  { id: "4", name: "Cine" },
  { id: "5", name: "Teatro" },
  { id: "6", name: "Lectura" },
  { id: "7", name: "Ocio" },
  { id: "8", name: "Eventos" },
];

type CategoryItem = {
  id: string | null;
  name: string;
};

function CategoryButton({
  category,
  isSelected,
  onPress,
}: {
  category: CategoryItem;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Button
      key={`category-${category.id}`}
      variant={isSelected ? "default" : "secondary"}
      className={`mr-2 rounded-full ${isSelected ? "bg-primary" : ""}`}
      onPress={onPress}
    >
      <Text
        className={isSelected ? "text-primary-foreground" : "text-foreground"}
      >
        {category.name}
      </Text>
    </Button>
  );
}

export default function Index() {
  const {
    fetchPlans,
    filteredPlans,
    selectedCategory,
    setFilteredPlans,
    setSelectedCategory,
    plans,
  } = usePlans();
  const { results, setSearchToNull } = useSearch();
  const [notifications, setNotifications] = React.useState(2);
  const { currentProfile, fetchProfileById } = useProfiles();
  const [refreshing, setRefreshing] = React.useState(false);
  const { user } = useUser();

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPlans();
    setRefreshing(false);
  }, []);

  // Initial setup
  React.useEffect(() => {
    const init = async () => {
      await fetchPlans();
      setSelectedCategory("1"); // Set default category to Música
    };
    init();
    fetchProfileById(user?.id as string);
  }, []);

  // Effect to update filtered plans when plans array changes
  React.useEffect(() => {

    if (selectedCategory) {
      // If there's a selected category, filter by it
      const categoryName = CATEGORIES.find(
        (cat) => cat.id === selectedCategory
      )?.name;
      if (categoryName) {
        const filtered = plans.filter((plan) =>
          plan.categories.includes(categoryName)
        );
        setFilteredPlans(filtered);
      }
    }

  }, [plans, selectedCategory]);

  if (!filteredPlans)
    return (
      <ActivityIndicator
        className="flex-1"
        style={{ flex: 1 }}
        animating={true}
      />
    );

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        className="bg-background"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {/* Custom Header */}
        <Animated.View
          entering={FadeInDown.springify()
            .mass(0.5)
            .damping(8)
            .stiffness(80)
            .duration(600)}
          className="bg-background flex flex-col gap-4 web:md:max-w-4xl web:md:mx-auto web:md:px-4"
        >
          <View className="flex-row items-center justify-between p-4">
            <View>
              <Text className="text-3xl font-bold">
                ¡Hola! {user?.firstName?.split(" ")[0]} 👋
              </Text>
              <Text className="text-base text-muted-foreground">
                Descubre planes increíbles
              </Text>
            </View>
            <View className="flex-row items-center gap-6">
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed || results?.length > 0 ? "red" : "transparent",
                  },
                ]}
                onPress={() => {
                  if (results?.length > 0) {
                    setSearchToNull();
                  } else {
                    router.push("/(screens)/search");
                  }
                }}
              >
                <Search color="#FF5733" size={24} />
              </Pressable>
              <TouchableOpacity
                onPress={() => router.push("/(screens)/notifications")}
              >
                <View className="relative">
                  {notifications > 0 ? (
                    <BellDot color="#FF5733" size={24} />
                  ) : (
                    <Bell color="#FF5733" size={24} />
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(screens)/my-profile")}
              >
                <Avatar alt="profile">
                  <AvatarImage source={{ uri: currentProfile?.image_url as string }} />
                  <AvatarFallback>
                    <Text>{user?.firstName?.[0]}</Text>
                  </AvatarFallback>
                </Avatar>
              </TouchableOpacity>
            </View>
          </View>



          {/* Categories */}
          {results.length <= 0 && (
            <View className="web:md:px-4 mb-8">
              <Text className="text-muted-foreground px-4 mb-4">
                Categorías
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="pl-4 web:md:pl-4"
              >
                {CATEGORIES.map((category) => (
                  <CategoryButton
                    key={category.id}
                    category={category}
                    isSelected={selectedCategory === category.id}
                    onPress={() => setSelectedCategory(category.id)}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </Animated.View>
        <FlashList
          data={results.length > 0 ? results : filteredPlans}
          estimatedItemSize={200}
          renderItem={({ item, index }) => <PlanCard plan={item} index={index} />}
          ListEmptyComponent={
            <View className="flex-1 mt-16 justify-center items-center web:md:max-w-4xl web:md:mx-auto">
              <View
                style={{
                  backgroundColor: "#E5E5E5",
                  borderRadius: 999,
                  padding: 10,
                }}
              >
                <Image
                  source={{
                    uri: "https://img.icons8.com/?size=300&id=97CiUKVEgclT&format=png&color=000000",
                  }}
                  style={{
                    width: 100,
                    height: 100,
                  }}
                />
              </View>
              <Text className="text-center mt-5 text-muted-foreground mx-auto w-2/3">
                No se encontraron planes que coincidan
              </Text>
            </View>
          }
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
