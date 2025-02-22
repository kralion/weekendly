import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

type Notification = {
  id: string;
  type: "invitation" | "update" | "reminder" | "social";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionRequired?: boolean;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "invitation",
    title: "Nueva invitación",
    message: "Juan te ha invitado a 'Tarde de Café'",
    time: "Hace 5 minutos",
    read: false,
    actionRequired: true,
  },
  {
    id: "2",
    type: "update",
    title: "Actualización del plan",
    message: "El lugar de 'Noche de Pizza' ha cambiado",
    time: "Hace 1 hora",
    read: false,
  },
  {
    id: "3",
    type: "reminder",
    title: "Recordatorio",
    message: "Tu plan 'Cine en Casa' comienza en 2 horas",
    time: "Hace 2 horas",
    read: true,
  },
  {
    id: "4",
    type: "social",
    title: "Plan aceptado",
    message: "María aceptó tu invitación a 'Tarde de Juegos'",
    time: "Hace 3 horas",
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      className={`p-4 border-b border-gray-100 ${
        !notification.read ? "bg-purple-50" : "bg-white"
      }`}
      onPress={() => {
        // Mark as read and handle navigation
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
        );
      }}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="font-semibold">{notification.title}</Text>
        <Text className="text-xs text-gray-500">{notification.time}</Text>
      </View>
      <Text className="text-gray-600 mb-2">{notification.message}</Text>

      {notification.actionRequired && (
        <View className="flex-row gap-2 mt-2">
          <Button
            variant="default"
            className="flex-1"
            onPress={() => {
              // Handle accept
              setNotifications((prev) =>
                prev.filter((n) => n.id !== notification.id)
              );
            }}
          >
            <Text className="text-white">Aceptar</Text>
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onPress={() => {
              // Handle decline
              setNotifications((prev) =>
                prev.filter((n) => n.id !== notification.id)
              );
            }}
          >
            <Text>Rechazar</Text>
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
          <ChevronLeft size={24} />
        </Button>
        <Text className="text-xl font-semibold ml-4">Notificaciones</Text>
      </View>

      {/* Notifications List */}
      <ScrollView className="flex-1">
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
