import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Bell, BellDot, Search, X } from "lucide-react-native";
import * as React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { PlanCard } from "~/components/PlanCard";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { usePlans } from "~/stores";
import { Plan } from "~/types";

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
    searchQuery,
    setSearchQuery,
    setFilteredPlans,
    setSelectedCategory,
    plans,
  } = usePlans();
  const searchRef = React.useRef<TextInput>(null);
  const [notifications, setNotifications] = React.useState(2);
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
  }, []);

  // Effect to update filtered plans when plans array changes
  React.useEffect(() => {
    if (plans.length > 0) {
      if (searchQuery) {
        // If there's a search query, filter by relevance
        const filtered = plans
          .filter((plan) => {
            const titleMatch = plan.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
            const descriptionMatch = plan.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
            const locationMatch = plan.location
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
            const categoryMatch = plan.categories.some((cat) =>
              cat.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return (
              titleMatch || descriptionMatch || locationMatch || categoryMatch
            );
          })
          .sort((a, b) => {
            // Calculate relevance score
            const getScore = (plan: Plan) => {
              let score = 0;
              const lowerQuery = searchQuery.toLowerCase();
              if (plan.title.toLowerCase().includes(lowerQuery)) score += 10;
              if (plan.title.toLowerCase().startsWith(lowerQuery)) score += 5;
              if (plan.description.toLowerCase().includes(lowerQuery))
                score += 3;
              if (plan.location.toLowerCase().includes(lowerQuery)) score += 2;
              if (
                plan.categories.some((cat) =>
                  cat.toLowerCase().includes(lowerQuery)
                )
              )
                score += 1;
              return score;
            };
            return getScore(b) - getScore(a);
          });
        setFilteredPlans(filtered);
      } else if (selectedCategory) {
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
    }
  }, [plans, searchQuery, selectedCategory]);

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
                  <AvatarImage source={{ uri: user?.imageUrl }} />
                  <AvatarFallback>
                    <Text>{user?.firstName?.[0]}</Text>
                  </AvatarFallback>
                </Avatar>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center justify-between p-4 web:md:justify-center web:md:gap-4">
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
              className="web:md:w-96 "
            />
            <Button
              variant="secondary"
              size="lg"
              hitSlop={10}
              className="rounded-full px-4"
              onPress={() => {
                searchQuery ? setSearchQuery("") : searchRef.current?.focus();
              }}
            >
              {searchQuery ? (
                <X color="#FF5733" size={20} />
              ) : (
                <Search color="#FF5733" size={20} />
              )}
            </Button>
          </View>

          {/* Categories */}
          {!searchQuery && (
            <View className="web:md:px-4">
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

        <Text className="text-muted-foreground mb-8 m-4 web:md:max-w-4xl web:md:mx-auto web:md:px-4">
          {searchQuery ? "Mejor coincidencia" : "Plan Sugerido"}
        </Text>
        {filteredPlans.length > 0 ? (
          <View className="web:md:max-w-4xl web:md:mx-auto">
            <PlanCard plan={filteredPlans[0]} index={0} />
            <View className="p-4 ">
              <Text className="text-center text-sm text-muted-foreground">
                TIP: Tap en plan para ver un scroll de planes relacionados.
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-1 mt-16 justify-center items-center web:md:max-w-4xl web:md:mx-auto">
            <View
              style={{
                backgroundColor: "#E5E5E5",
                borderRadius: 999,
                padding: 10,
              }}
            ></View>
            <Text className="text-center mt-5 text-muted-foreground mx-auto w-2/3">
              No se encontraron planes que coincidan con{" "}
              {searchQuery ? "tu búsqueda" : "la categoría seleccionada"}.
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
