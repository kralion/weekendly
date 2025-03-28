import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useLocalSearchParams } from "expo-router";
import { CheckCircle, ChevronLeft, MapPin, X } from "lucide-react-native";
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
import { generateAPIUrl } from "~/lib/utils";
import { useProfiles } from "~/stores";

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const { fetchSpecificProfileById, profile, loading } = useProfiles();
  const [userInfo, setUserInfo] = React.useState<{
    first_name: string;
    last_name: string;
    image_url: string;
  } | null>(null);
  const [fetchingClerkData, setFetchingClerkData] = React.useState(false);

  const handleInstagramPress = () => {
    if (profile?.ig_username) {
      Linking.openURL(profile.ig_username);
    }
  };

  const handleWhatsappPress = () => {
    if (profile?.phone) {
      Linking.openURL(`https://wa.me/+${profile.phone}`);
    }
  };

  async function fetchClerkUserData() {
    setFetchingClerkData(true);
    const response = await fetch(generateAPIUrl(`/api/profile/${id}`));
    const userData = await response.json();
    setUserInfo({
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      image_url: profile?.image_url || "",
    });
    setFetchingClerkData(false);
  }

  React.useEffect(() => {
    fetchSpecificProfileById(id as string);
    fetchClerkUserData();
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
      <ScrollView className="bg-background" contentContainerClassName="pb-10 web:md:pb-16 web:md:w-1/2 web:mx-auto">
        {/* Profile Banner */}
        <View className="relative " style={{ height: 300 }}>
          <Image
            source={{
              uri: userInfo?.image_url,
            }}
            style={{ width: "100%", height: "100%" }}
            className="absolute web:md:rounded-xl"
          />

          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,0.8)"]}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
            className="web:md:rounded-xl"
          />

          <View className="p-4 flex-row mt-4 justify-between items-center absolute top-0  right-0 z-10">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
            >
              <X size={24} color="white" />
            </TouchableOpacity>

          </View>
        </View>

        {/* Profile Info */}
        <View className="px-4 flex-col gap-8">


          <View className="mt-4 flex-row justify-between items-center">
            <View>
              <View className="flex-col">
                <Text className="text-2xl font-bold">
                  {userInfo?.first_name}
                </Text>
                <View className="flex-row gap-1 items-center">
                  <MapPin size={14} color="gray" />
                  <Text className="text-muted-foreground">
                    {profile?.residency}
                  </Text>
                </View>
              </View>
            </View>

            <Button variant="secondary" size="icon" onPress={handleInstagramPress}>
              <Image source={{ uri: "https://img.icons8.com/?size=200&id=d9OelZDsJJqN&format=png&color=000000" }} className="w-8 h-8" />
            </Button>

          </View>

          <View className=" flex flex-col">
            <Text className="text-lg font-semibold mb-2 web:md:text-xl">
              Bio
            </Text>
            <View className="bg-muted p-4 rounded-lg web:md:p-6">
              <Text className="text-muted-foreground web:md:text-base">
                {profile?.bio}
              </Text>
            </View>
          </View>

          {/* Hobbies Section */}
          <View >
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
            onPress={handleWhatsappPress}
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
