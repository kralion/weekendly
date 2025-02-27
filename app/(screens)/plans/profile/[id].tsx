import { router, useLocalSearchParams } from "expo-router";
import { CheckCircle, X } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useProfiles } from "~/stores";
import Constants from "expo-constants";

const API_URL = "https://weekendly-app.vercel.app";

const generateAPIUrl = (relativePath: string) => {
  console.log("Constants", Constants.experienceUrl);

  const origin =
    Constants?.experienceUrl?.replace("exp://", "http://") || API_URL;

  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;

  if (process.env.NODE_ENV === "development") {
    return origin?.concat(path);
  }

  if (!API_URL) {
    throw new Error("API_URL environment variable is not defined");
  }

  return API_URL.concat(path);
};

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const { fetchProfileById, profile, loading } = useProfiles();
  const [userInfo, setUserInfo] = React.useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const [fetchingClerkData, setFetchingClerkData] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchProfileById(id as string);
  }, [id]);
  async function fetchClerkUserData() {
    setFetchingClerkData(true);
    const response = await fetch(generateAPIUrl(`/profile/${id}`));
    const userData = await response.json();
    setUserInfo({
      firstName: userData.first_name || "",
      lastName: userData.last_name || "",
    });
    setFetchingClerkData(false);
  }

  React.useEffect(() => {
    if (id) {
      fetchClerkUserData();
    }
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
                  uri: profile?.image_url as string,
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
                  {userInfo?.firstName || "Cargando..."}{" "}
                  {userInfo?.lastName || ""}
                </Text>
                <CheckCircle size={16} color="#1DA1F2" className="ml-1" />
              </View>
              {fetchError && (
                <Text className="text-red-500 text-sm mt-1">
                  Error al cargar información de usuario
                </Text>
              )}
            </View>
            <Text className="text-gray-600 dark:text-gray-400">
              {profile?.created_at?.split("T")[0]}
            </Text>
          </View>

          <Text className="mt-4 text-gray-800 dark:text-gray-200">
            {profile?.bio || "No hay biografía aún"}
          </Text>

          {/* Hobbies Section */}
          <View className="mt-6">
            <Text className="text-lg font-semibold mb-2">Pasatiempos</Text>
            <View className="flex-row flex-wrap gap-2">
              {profile?.hobbies?.map((hobby, index) => (
                <View
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full"
                >
                  <Text className="text-blue-800 dark:text-blue-200">
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
              if (profile?.phone) {
                Linking.openURL(
                  `https://wa.me/${profile.phone}?text=Hola que tal%20`
                );
              } else {
                toast.error("No hay número de teléfono disponible");
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
