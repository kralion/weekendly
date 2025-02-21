import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Bell, MapPin, Plus, Search } from "lucide-react-native";
import * as React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useCategories, usePlans } from "~/stores";
import { Category, Plan } from "~/types";

// Type for category items in the list (includes the "Todos" option)
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
      variant={isSelected ? "default" : "secondary"}
      className="mr-2 rounded-full"
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
  const { plans, loading: plansLoading, fetchPlans } = usePlans();
  const {
    categories,
    loading: categoriesLoading,
    fetchCategories,
  } = useCategories();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    fetchPlans();
    fetchCategories();
  }, []);

  // Handle category selection
  const handleCategoryPress = (categoryId: string | null) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // Split categories into two rows
  const allCategories = React.useMemo(() => {
    const categoriesWithAll: CategoryItem[] = [
      { id: null, name: "Todos" },
      ...categories.map((cat) => ({ id: cat.id, name: cat.name })),
    ];
    return {
      firstRow: categoriesWithAll.slice(0, 4),
      secondRow:
        categoriesWithAll.length > 4 ? categoriesWithAll.slice(4, 8) : [],
    };
  }, [categories]);

  // Filter plans based on category and search
  const getFilteredPlans = () => {
    if (!plans) return [];

    return plans.filter((plan) => {
      const matchesCategory =
        !selectedCategory || plan.category_id === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  };

  if (categoriesLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} className="bg-background">
      {/* Custom Header */}
      <Animated.View
        entering={FadeIn}
        style={{ paddingTop: insets.top }}
        className="bg-background p-4 flex flex-col gap-8"
      >
        <View className="flex-row items-center justify-between ">
          <View>
            <Text className="text-2xl font-bold">
              ¡Hola! {user?.firstName} 👋
            </Text>
            <Text className="text-base text-muted-foreground">
              Descubre planes increíbles
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity>
              <View className="relative">
                <Bell size={24} />
                <View className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(screens)/profile")}>
              <Avatar alt="profile">
                <AvatarImage source={{ uri: user?.imageUrl }} />
                <AvatarFallback>
                  <Text>{user?.firstName?.[0]}</Text>
                </AvatarFallback>
              </Avatar>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center justify-between">
          <Input
            placeholder="Buscar planes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              width: 300,
              height: 50,
              borderRadius: 999,
              paddingLeft: 24,
            }}
          />
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full  px-4"
            onPress={() => router.push("/(screens)/plans/create")}
          >
            <Plus size={20} />
          </Button>
        </View>

        {/* Categories */}
        <View>
          <Text className="text-base font-medium mb-2">Categorías</Text>
          <View className="flex flex-col gap-2">
            {/* First Row */}
            <FlashList
              estimatedItemSize={100}
              data={allCategories.firstRow}
              renderItem={({ item }) => (
                <CategoryButton
                  category={item}
                  isSelected={selectedCategory === item.id}
                  onPress={() => handleCategoryPress(item.id)}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id ?? "all"}
            />

            {allCategories.secondRow.length > 0 && (
              <FlashList
                estimatedItemSize={100}
                data={allCategories.secondRow}
                renderItem={({ item }) => (
                  <CategoryButton
                    category={item}
                    isSelected={selectedCategory === item.id}
                    onPress={() => handleCategoryPress(item.id)}
                  />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id ?? "all"}
              />
            )}
          </View>
        </View>
      </Animated.View>

      {/* Plans List */}
      <FlashList
        estimatedItemSize={Dimensions.get("window").height}
        data={getFilteredPlans()}
        renderItem={({ item }) => <PlanCard plan={item} />}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        horizontal
        decelerationRate="fast"
        pagingEnabled
        getItemType={(item) => "plan"}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-lg text-center text-muted-foreground">
              {searchQuery || selectedCategory
                ? "No se encontraron planes que coincidan con tu búsqueda"
                : "No hay planes disponibles en este momento"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Pressable
      style={{ width: 280, height: 400 }}
      className="ml-4 bg-white rounded-3xl overflow-hidden relative"
      onPress={() => router.push("/(screens)/plans")}
    >
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1513689125086-6c432170e843",
        }}
        style={{ width: "100%", height: "100%" }}
        className="absolute"
      />

      <Animated.View
        entering={FadeIn}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
        }}
      >
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
      </Animated.View>

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
