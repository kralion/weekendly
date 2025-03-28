import { useUser } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { RefreshControl, View } from "react-native";
import Animated, {
  FadeInDown
} from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { useInvitations } from "~/stores/useInvitations";
import { Invitation } from "~/types";
import { NotificationItem } from "~/components/NotificationItem";



export default function NotificationsScreen() {
  const {
    invitations: notifications,
    getInvitationsByUserId,
    acceptInvitation,
    rejectInvitation,
  } = useInvitations();
  const [selectedNotification, setSelectedNotification] =
    React.useState<Invitation | null>(null);
  const { user } = useUser();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    getInvitationsByUserId(user?.id as string);
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    getInvitationsByUserId(user?.id as string);
  }, []);

  const handleAcceptInvitation = (notification: Invitation) => {
    acceptInvitation(notification.id);
    setSelectedNotification(null);
  };

  const handleRejectInvitation = (notification: Invitation) => {
    rejectInvitation(notification.id);
    setSelectedNotification(null);
  };
  const handleSelect = (notification: Invitation) => {
    setSelectedNotification((prev) =>
      prev?.id === notification.id ? null : notification
    );
  };

  return (
    <View className="flex-1 bg-background pt-12">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(500).springify()}
        className="px-6 py-4 flex-row items-center bg-background web:md:mx-auto web:md:w-1/2"
      >
        <Button
          className="rounded-full"
          onPress={() => router.back()}
          variant="secondary"
          size="icon"
        >
          <ChevronLeft size={24} color="#FF5733" />
        </Button>
        <Text className="text-xl font-semibold ml-4 web:md:text-2xl">
          Notificaciones
        </Text>
      </Animated.View>

      {/* Notifications List */}
      <FlashList
        data={notifications}
        contentContainerClassName="px-8  web:md:mx-auto web:md:w-1/2"
        estimatedItemSize={100}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={({ item: notification, index }) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            index={index}
            isSelected={selectedNotification?.id === notification.id}
            onSelect={() => handleSelect(notification)}
            onAccept={() => handleAcceptInvitation(notification)}
            onReject={() => handleRejectInvitation(notification)}
          />
        )}
        ListEmptyComponent={
          <Animated.View
            entering={FadeInDown.delay(300).duration(800)}
            className="flex-1 justify-center items-center p-8 web:md:p-16"
          >
            <Text className="text-gray-500 text-center web:md:text-lg">
              No tienes notificaciones nuevas
            </Text>
          </Animated.View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}
