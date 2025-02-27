import { useLocalSearchParams } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  View,
} from "react-native";
import { toast } from "sonner-native";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useProfiles } from "~/stores";

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const { fetchSpecificProfileById, profile, loading } = useProfiles();
  const [userInfo, setUserInfo] = React.useState<{
    firstName: string;
    lastName: string;
    image_url: string;
  } | null>(null);
  const [fetchingClerkData, setFetchingClerkData] = React.useState(false);

  const fetchCreatorProfile = async (creatorId: string) => {
    setFetchingClerkData(true);
    try {
      const response = await fetch(
        `https://api.clerk.com/v1/users/${creatorId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_CLERK_SECRET_KEY}`,
          },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch creator profile: ${error.message}`);
      }

      const data = await response.json();
      setUserInfo({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        image_url: data.image_url,
      });
    } catch (error) {
      console.error("Error fetching creator profile:", error);
      toast.error("No se pudo cargar el perfil del creador");
    } finally {
      setFetchingClerkData(false);
    }
  };

  React.useEffect(() => {
    fetchSpecificProfileById(id as string);
    fetchCreatorProfile(id as string);
  }, [id]);
  if (loading || fetchingClerkData) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="bg-background" contentContainerClassName="pb-10">
        {/* Profile Banner */}
        <View style={{ position: "relative", width: "100%", height: 200 }}>
          <Image
            source={{
              uri: "https://plus.unsplash.com/premium_photo-1701766169067-412484e22158?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b3JhbmdlJTIwZ3JhZGllbnR8ZW58MHx8MHx8fDA%3D",
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
                  uri: userInfo?.image_url,
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
            <Text className="text-gray-600 dark:text-gray-400">
              {profile?.created_at?.split("T")[0]}
            </Text>
          </View>

          <Text className="mt-4 text-gray-800 dark:text-gray-200">
            {profile?.bio}
          </Text>

          {/* Hobbies Section */}
          <View className="mt-6">
            <Text className="text-lg font-semibold mb-2">Intereses</Text>
            <View className="flex-row flex-wrap gap-2">
              {profile?.hobbies?.map((hobby, index) => (
                <View
                  key={index}
                  className="px-4 py-2 rounded-xl bg-gray-200 web:md:px-5 web:md:py-3"
                >
                  <Text className="text-gray-800 font-medium web:md:text-base">
                    {hobby}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <Button
            className="rounded-full mt-10 bg-[#25D366] flex-row items-center gap-2"
            size="lg"
            onPress={() => {
              if (
                profile?.phone &&
                profile.phone.length === 9 &&
                profile.phone.startsWith("9")
              ) {
                Linking.openURL(
                  `https://wa.me/${profile.phone}?text=Hola que tal%20`
                );
              } else if (profile?.phone) {
                toast.warning("Por ahora solo soportamos telefonos para perú");
              } else {
                toast.error(
                  "No hay número de teléfono disponible para este perfil"
                );
              }
            }}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/?size=100&id=85088&format=png&color=FFFFFF",
              }}
              style={{ width: 20, height: 20 }}
            />
            <Text className="text-white"> Hablar por Whatsapp </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
