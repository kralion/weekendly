import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Bell, BellDot, MapPin, Search, X } from "lucide-react-native";
import * as React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  withDelay,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { usePlans } from "~/stores";
import { Plan } from "~/types";

const CATEGORIES = [
  { id: null, name: "Todos" },
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
  const { plans, loading: plansLoading, fetchPlans } = usePlans();
  const searchRef = React.useRef<TextInput>(null);
  const [notifications, setNotifications] = React.useState(2);
  const [refreshing, setRefreshing] = React.useState(false);
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPlans();
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    fetchPlans();
  }, []);

  const handleCategoryPress = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const getFilteredPlans = () => {
    return plans.filter((plan) => {
      const selectedCategoryName = selectedCategory
        ? CATEGORIES.find((cat) => cat.id === selectedCategory)?.name
        : null;

      const matchesCategory =
        !selectedCategoryName || plan.categories.includes(selectedCategoryName);
      const matchesSearch = plan.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      className="bg-background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Custom Header */}
      <Animated.View
        entering={FadeInDown.springify()
          .mass(0.5)
          .damping(8)
          .stiffness(80)
          .duration(600)}
        className="bg-background   flex flex-col gap-4"
      >
        <View className="flex-row items-center justify-between p-4">
          <View>
            <Text className="text-3xl font-bold">
              ¡Hola! {user?.firstName} 👋
            </Text>
            <Text className="text-base text-muted-foreground">
              Descubre planes increíbles
            </Text>
          </View>
          <View className="flex-row items-center gap-6">
            <TouchableOpacity
              onPress={() => router.push("/(screens)/notifications")}
            >
              <View className="relative">
                {notifications > 0 ? (
                  <BellDot color="#A020F0" size={24} />
                ) : (
                  <Bell color="#A020F0" size={24} />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(screens)/my-profile")}
            >
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
        <View className="flex-row items-center justify-between p-4">
          <Input
            placeholder="Buscar planes..."
            ref={searchRef}
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
            hitSlop={10}
            className="rounded-full  px-4"
            onPress={() => {
              searchQuery ? setSearchQuery("") : searchRef.current?.focus();
            }}
          >
            {searchQuery ? (
              <X color="#A020F0" size={20} />
            ) : (
              <Search color="#A020F0" size={20} />
            )}
          </Button>
        </View>

        {/* Categories */}
        <View>
          <Text className="text-muted-foreground px-4  mb-4 ">Categorías</Text>
          <View className="flex flex-col gap-2 ">
            {/* First Row */}
            <FlashList
              estimatedItemSize={100}
              data={CATEGORIES}
              extraData={selectedCategory}
              contentContainerClassName="pl-4"
              renderItem={({ item }) => (
                <CategoryButton
                  key={item.id}
                  category={item}
                  isSelected={selectedCategory === item.id}
                  onPress={() => handleCategoryPress(item.id)}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id ?? "all"}
            />
          </View>
        </View>
      </Animated.View>

      {/* Plans List */}
      <Text className="text-muted-foreground mb-8  m-4 ">Planes Sugeridos</Text>
      <FlashList
        estimatedItemSize={Dimensions.get("window").height}
        data={getFilteredPlans()}
        renderItem={({ item, index }) => <PlanCard plan={item} index={index} />}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => (item.id ? item.id : item.title)}
        snapToAlignment="start"
        horizontal
        decelerationRate="fast"
        pagingEnabled
        getItemType={(item) => "plan"}
        ListEmptyComponent={
          <View className="flex-1 mt-16 justify-center items-center">
            <Image
              source={{
                uri: "https://img.icons8.com/?size=200&id=p7WlmbKvtsHM&format=png&color=000000",
              }}
              style={{ width: 100, height: 100 }}
            />
            <Text className=" text-center text-muted-foreground mx-auto w-2/3 ">
              No se encontraron planes que coincidan con el filtro o búsqueda.
            </Text>
          </View>
        }
      />
    </ScrollView>
  );
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .springify()
        .mass(0.5)
        .damping(8)
        .stiffness(80)}
    >
      <Pressable
        style={{ width: 280, height: 400 }}
        className="ml-4 bg-white rounded-3xl overflow-hidden relative"
        onPress={() => router.push("/(screens)/plans")}
      >
        <Image
          source={{
            uri: plan.image_url,
          }}
          style={{ width: "100%", height: "100%" }}
          className="absolute"
        />

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

        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Text className="text-2xl font-bold mb-2 text-white">
            {plan.title}
          </Text>

          <View className="flex-row items-center mb-2 gap-1">
            <MapPin size={16} color="white" className="mr-1" />
            <Text className="text-white text-sm">{plan.location}</Text>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-3">
            {plan.categories.map((category, index) => (
              <View key={index} className="bg-white/20 px-3 py-1 rounded-full">
                <Text className="text-white text-sm">{category}</Text>
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
    </Animated.View>
  );
}
