import { router, useLocalSearchParams } from "expo-router";
import { CheckCircle, MessageCircleDashedIcon, X } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { openBrowserAsync } from "expo-web-browser";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { useProfiles } from "~/stores";
export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const { fetchSpecificProfileById, profile, loading } = useProfiles();
  const [userInfo, setUserInfo] = React.useState<{
    id: string;
    username: string;
    imageUrl: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  React.useEffect(() => {
    fetchSpecificProfileById(id as string);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="bg-background" contentContainerClassName="pb-10">
        {/* Header */}
        <View className="p-4 flex-row  justify-between items-center absolute top-0 left-0 right-0 z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
          >
            <X size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Profile Banner */}
        <View style={{ position: "relative", width: "100%", height: 200 }}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1513689125086-6c432170e843",
            }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </View>

        {/* Profile Info */}
        <View className="px-4 -mt-16">
          <View className="relative">
            <View className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
              <Image
                source={{
                  uri: userInfo?.imageUrl,
                }}
                className="w-full h-full"
              />
            </View>
            <View className="absolute top-0 left-0 w-24 h-24 rounded-full border-2 border-blue-500" />
            <View className="absolute bottom-0 left-16 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
          </View>

          <View className="mt-4 flex-row justify-between items-center">
            <View>
              <View className="flex-row items-center gap-2">
                <Text className="text-xl font-bold">
                  {userInfo?.firstName} {userInfo?.lastName}
                </Text>
                <CheckCircle size={16} color="#1DA1F2" className="ml-1" />
              </View>
            </View>
            <Text className="text-gray-600">
              {profile?.created_at?.split("T")[0]}
            </Text>
          </View>

          <Text className="mt-4 text-gray-800">
            {profile?.bio || "No hay biografía aún"}
          </Text>

          {/* Hobbies Section */}
          <View className="mt-6">
            <Text className="text-lg font-semibold mb-2">Pasatiempos</Text>
            <View className="flex-row flex-wrap gap-2">
              {profile?.hobbies?.map((hobby, index) => (
                <View
                  key={index}
                  className="bg-blue-100 px-3 py-1 rounded-full"
                >
                  <Text className="text-blue-800">{hobby}</Text>
                </View>
              ))}
            </View>
          </View>
          <Button
            className="rounded-full mt-10  bg-[#25D366] flex-row items-center gap-2"
            size="lg"
            onPress={() =>
              openBrowserAsync(
                `https://wa.me/${profile?.phone}?text=Hola que tal%20`
              )
            }
          >
            <MessageCircleDashedIcon size={22} color="white" />
            <Text className="text-white"> Hablar por Whatsapp </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
