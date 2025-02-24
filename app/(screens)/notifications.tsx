import { useUser } from "@clerk/clerk-expo";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Check, ChevronLeft, X } from "lucide-react-native";
import React from "react";
import { RefreshControl, Vibration } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useInvitations } from "~/stores/useInvitations";
import { Invitation } from "~/types";

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

  const renderNotification = (notification: Invitation) => (
    <TouchableOpacity
      key={notification.id}
      className="p-4 border-b border-gray-200 "
      onPress={() => {
        setSelectedNotification(
          notification.id === selectedNotification?.id ? null : notification
        );
      }}
    >
      <View className="flex-row items-start gap-4">
        <Image
          source={{
            uri: notification.sender?.image_url,
          }}
          style={{ width: 40, height: 40, borderRadius: 999 }}
        />
        <View className="flex-1 flex flex-col gap-0">
          <View className="flex-row justify-between items-center">
            <Text className="font-semibold">
              {notification.sender?.username} te invitó a este plan
            </Text>
            <Text className="text-sm text-gray-500">
              {format(new Date(notification.created_at), "dd/MM/yyyy", {
                locale: es,
              })}
            </Text>
          </View>
          <Text className="text-gray-600 mb-2">{notification.message}</Text>
        </View>
      </View>

      {selectedNotification?.id === notification.id && (
        <View className="flex-row gap-2 items-center mt-4 ">
          <Button
            className="flex-1"
            onPress={() => {
              router.push(
                `/(screens)/plans/plan/${selectedNotification.plan_id}`
              );
            }}
          >
            <Text className="text-white">Ver detalles</Text>
          </Button>
          <Button
            className="flex-1"
            variant="secondary"
            onPress={() => {
              markAsRead(selectedNotification.id);
              setSelectedNotification(null);
              Vibration.vibrate(50);
            }}
          >
            <Text>Marcar como leído</Text>
          </Button>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background pt-12">
      {/* Header */}
      <View className="p-6 flex-row items-center bg-background">
        <Button
          className="rounded-full"
          onPress={() => router.back()}
          variant="secondary"
          size="icon"
        >
          <ChevronLeft size={24} color="#FF5733" />
        </Button>
        <Text className="text-xl font-semibold ml-4">Notificaciones</Text>
      </View>

      {/* Notifications List */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {notifications.length > 0 ? (
          notifications.map(renderNotification)
        ) : (
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-gray-500 text-center">
              No tienes notificaciones nuevas
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
