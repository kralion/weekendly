import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInDown
} from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Invitation } from "~/types";

export const NotificationItem = React.memo(
  ({
    notification,
    index,
    onAccept,
    onReject,
  }: {
    notification: Invitation;
    index: number;
    onAccept: () => void;
    onReject: () => void;
  }) => {


    return (
      <Animated.View entering={FadeInDown.delay(index * 100).springify()}>

        <View className="flex-col web:md:flex-row web:md:gap-10 p-4 web:md:items-center">
          <TouchableOpacity
            className="flex flex-row items-center gap-2"
            onPress={() => router.push(`/(screens)/plans/profile/${notification.sender_id}`)}
          >
            <Image
              source={{
                uri: notification.sender?.image_url,
              }}
              style={{ width: 40, height: 40, borderRadius: 999 }}
              className="web:md:w-12 web:md:h-12"
            />



            <View className="flex-1 flex flex-col gap-0">
              <View className="flex-row gap-6 items-center">
                <Text className="font-semibold web:md:text-lg">
                  {notification.sender?.username} {notification.type === "request" ? "solicita unirse a tu plan" : "te invita unirse a un plan"}
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
            </View></TouchableOpacity>
          <View className="flex-row gap-2 items-center px-4 ">
            <Button className="flex-1 web:md:w-1/2" onPress={onAccept}>
              <Text >Aceptar</Text>
            </Button>
            <Button variant="secondary" className="flex-1 web:md:w-1/2" onPress={onReject}>
              <Text>Rechazar</Text>
            </Button>
          </View>

        </View>
      </Animated.View>
    );
  }
);
