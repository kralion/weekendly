import { useUser } from "@clerk/clerk-expo";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { RefreshControl, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useInvitations } from "~/stores/useInvitations";
import { Invitation } from "~/types";

const NotificationItem = React.memo(
  ({
    notification,
    index,
    isSelected,
    onSelect,
    onAccept,
    onReject,
  }: {
    notification: Invitation;
    index: number;
    isSelected: boolean;
    onSelect: () => void;
    onAccept: () => void;
    onReject: () => void;
  }) => {
    const expandStyle = useAnimatedStyle(() => ({
      height: withTiming(isSelected ? 80 : 0, { duration: 300 }),
      opacity: withTiming(isSelected ? 1 : 0),
      overflow: "hidden",
    }));

    return (
      <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
        <TouchableOpacity
          className="p-4 border-b border-muted web:md:max-w-2xl web:md:mx-auto web:md:p-5"
          onPress={onSelect}
        >
          <View className="flex-row gap-2">
            <Image
              source={{
                uri: notification.sender?.image_url,
              }}
              style={{ width: 40, height: 40, borderRadius: 999 }}
              className="web:md:w-12 web:md:h-12"
            />
            <View className="flex-1 flex flex-col gap-0">
              <View className="flex-row justify-between items-center">
                <Text className="font-semibold web:md:text-lg">
                  {notification.sender?.username} te invitó a este plan
                </Text>
                <Text className="text-sm text-gray-500 web:md:text-base">
                  {format(new Date(notification.created_at), "dd/MM/yyyy", {
                    locale: es,
                  })}
                </Text>
              </View>
              <Text className="text-gray-600 mb-2 web:md:text-base">
                {notification.message}
              </Text>
            </View>
          </View>

          <Animated.View style={expandStyle}>
            <View className="flex-row gap-2 items-center mt-4 web:md:max-w-md web:md:mx-auto">
              <Button className="flex-1" onPress={onAccept}>
                <Text className="text-white">Ver Plan</Text>
              </Button>
              <Button variant="secondary" className="flex-1" onPress={onReject}>
                <Text>Marcar como leido</Text>
              </Button>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

export default function NotificationsScreen() {
  const {
    invitations: notifications,
    getInvitationsByUserId,
    markAsRead,
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
    router.push(`/(screens)/plans/plan/${notification.plan_id}`);
  };

  const handleRejectInvitation = (notification: Invitation) => {
    // Add rejection logic here
    markAsRead(notification.id);
    setSelectedNotification(null);
  };

  return (
    <View className="flex-1 bg-background pt-12">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(500).springify()}
        className="p-6 flex-row items-center bg-background web:md:max-w-2xl web:md:mx-auto"
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
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              index={index}
              isSelected={selectedNotification?.id === notification.id}
              onSelect={() => {
                setSelectedNotification(
                  notification.id === selectedNotification?.id
                    ? null
                    : notification
                );
              }}
              onAccept={() => handleAcceptInvitation(notification)}
              onReject={() => handleRejectInvitation(notification)}
            />
          ))
        ) : (
          <Animated.View
            entering={FadeInDown.delay(300).duration(800)}
            className="flex-1 justify-center items-center p-8 web:md:p-16"
          >
            <Text className="text-gray-500 text-center web:md:text-lg">
              No tienes notificaciones nuevas
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
