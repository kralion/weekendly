import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { Bell, BellDot, Plus, Search } from "lucide-react";
import * as React from "react";
import { PlanCard } from "~/components/PlanCard";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { usePlans, useProfiles, useSearch } from "~/stores";
import { useInvitations } from "~/stores/useInvitations";

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

type CategoryItem = { id: string | null; name: string };

function CategoryButton({
  category,
  isSelected,
  onClick,
}: {
  category: CategoryItem;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      key={`category-${category.id}`}
      variant={isSelected ? "default" : "secondary"}
      className={`mr-2 rounded-full ${isSelected ? "bg-primary" : ""}`}
      onClick={onClick}
    >
      <Text
        className={isSelected ? "text-primary-foreground" : "text-foreground"}
      >
        {category.name}
      </Text>
    </Button>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const {
    fetchPlans,
    filteredPlans,
    selectedCategory,
    setFilteredPlans,
    setSelectedCategory,
    plans,
  } = usePlans();
  const { results, setSearchToNull } = useSearch();
  const { currentProfile, fetchProfileById } = useProfiles();
  const { invitations } = useInvitations();
  const [refreshing, setRefreshing] = React.useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPlans().finally(() => setRefreshing(false));
  }, [fetchPlans]);

  React.useEffect(() => {
    const init = async () => {
      await fetchPlans();
      setSelectedCategory("1");
    };
    init();
    if (user?.id) fetchProfileById(user.id);
  }, []);

  React.useEffect(() => {
    if (selectedCategory) {
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

  if (!filteredPlans) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const displayPlans = results.length > 0 ? results : filteredPlans;

  return (
    <div className="min-h-screen bg-background">
      <div className="overflow-y-auto">
        <div className="flex flex-col gap-4 md:w-[650px] md:mx-auto md:px-4">
          <div className="flex-row items-center justify-between p-4 md:w-[650px]">
            <div>
              <Text className="text-2xl font-bold">
                ¡Hola! {user?.firstName?.split(" ")[0]} 👋
              </Text>
              <Text className="text-base text-muted-foreground">
                Descubre planes increíbles
              </Text>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                className="rounded-full"
                size="icon"
                onClick={() => {
                  if (results?.length > 0) {
                    setSearchToNull();
                  } else {
                    navigate({ to: "/search" });
                  }
                }}
              >
                <Search className="text-primary" size={24} />
              </Button>
              <Button
                variant="ghost"
                className="rounded-full"
                size="icon"
                onClick={() => navigate({ to: "/notifications" })}
              >
                {invitations?.length > 0 ? (
                  <BellDot className="text-primary" size={24} />
                ) : (
                  <Bell className="text-primary" size={24} />
                )}
              </Button>
              <Button
                variant="ghost"
                className="rounded-full"
                size="icon"
                onClick={() => navigate({ to: "/plans/create" })}
              >
                <Plus className="text-primary" size={24} />
              </Button>
              <Button
                variant="ghost"
                className="rounded-full"
                size="icon"
                onClick={() => navigate({ to: "/my-profile" })}
              >
                <Avatar>
                  <AvatarImage src={currentProfile?.image_url ?? undefined} />
                  <AvatarFallback>
                    <Text>{user?.firstName?.[0]}</Text>
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>

          {results.length <= 0 && (
            <div className="md:px-4 mb-8">
              <Text className="text-muted-foreground px-4 mb-4">
                Categorías
              </Text>
              <div className="overflow-x-auto pl-4 md:pl-4 flex gap-2 pb-2">
                {CATEGORIES.map((category) => (
                  <CategoryButton
                    key={category.id}
                    category={category}
                    isSelected={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {displayPlans.length > 0 ? (
            displayPlans.map((plan, index) => (
              <PlanCard key={plan.id} plan={plan} index={index} />
            ))
          ) : (
            <div className="flex-1 mt-16 flex flex-col items-center justify-center md:max-w-4xl md:mx-auto">
              <div className="bg-muted rounded-full p-4">
                <img
                  src="https://img.icons8.com/?size=300&id=97CiUKVEgclT&format=png&color=000000"
                  alt="No plans"
                  className="w-[100px] h-[100px]"
                />
              </div>
              <Text className="text-center mt-5 text-muted-foreground mx-auto max-w-[66%]">
                No se encontraron planes que coincidan
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
