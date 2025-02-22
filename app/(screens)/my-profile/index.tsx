import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import {
  CheckCircle,
  ChevronLeft,
  Instagram,
  Twitter,
  Pen,
  MapPin,
  Globe,
  MessageCircle,
  MessageCircleDashedIcon,
} from "lucide-react-native";
import { openBrowserAsync } from "expo-web-browser";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useProfiles } from "~/stores";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [refreshing, setRefreshing] = React.useState(false);

  const { currentProfile, loading, fetchProfileById } = useProfiles();

  function onRefresh() {
    setRefreshing(true);
    if (user?.id) {
      fetchProfileById(user.id).finally(() => setRefreshing(false));
    }
  }

  React.useEffect(() => {
    if (user?.id) {
      fetchProfileById(user.id);
    }
  }, [user?.id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#A020F0" />
      </View>
    );
  }

  return (
    <ScrollView
      className="bg-white flex-1"
      contentContainerClassName="pb-10"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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

      {/* Header */}
      <View className="p-4 flex-row mt-10 justify-between items-center absolute top-0 left-0 right-0 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
        >
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View className="p-4 flex-row mt-10 justify-between items-center absolute top-0 right-0 z-10">
        <TouchableOpacity
          onPress={() => router.push(`/(screens)/my-profile/my-plans`)}
          className="w-28 h-10 justify-center items-center bg-black/20 rounded-full"
        >
          <Text className="text-white">Mis Planes </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View className="px-6 -mt-16">
        <View className="relative flex items-center">
          <View className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <Image source={{ uri: user?.imageUrl }} className="w-full h-full" />
          </View>
          <Button
            className="rounded-full absolute top-10 right-0 bg-white shadow-sm"
            variant="secondary"
            size="icon"
            onPress={() => router.push("/(screens)/my-profile/edit")}
          >
            <Pen color="#A020F0" size={18} />
          </Button>
        </View>

        {/* Name and Verification */}
        <View className="mt-4 flex flex-col justify-center items-center">
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-2xl font-bold text-gray-900">
              {user?.fullName}
            </Text>
            <CheckCircle size={20} color="#1DA1F2" />
          </View>
        </View>

        {/* Bio */}
        <Text className="my-4 text-gray-600 text-center">
          {currentProfile?.bio || "No hay biografía aún"}
        </Text>

        <View className="flex flex-row gap-4 mx-auto">
          <View className="flex flex-row gap-1 items-center">
            <MapPin size={18} color="gray" />
            <Text className="text-gray-500 mt-1">
              {currentProfile?.country}
            </Text>
          </View>
          <View className="flex flex-row gap-1 items-center">
            <Globe size={18} color="gray" />
            <Text className="text-gray-500 mt-1">
              {currentProfile?.languages?.join(", ")}
            </Text>
          </View>
        </View>
        {/* Social Links */}

        {/* Profile Details Cards */}
        <View className="mt-8 flex flex-col gap-4">
          <View className="bg-muted p-4 rounded-lg">
            <Text className="text-gray-500 mb-1">Día preferido</Text>
            <Text className="text-gray-900 font-medium">
              {currentProfile?.day_preferred}
            </Text>
          </View>
        </View>

        {/* Interests/Hobbies */}
        <View className="mt-8">
          <Text className="text-lg font-semibold mb-4 text-gray-900">
            Intereses
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {currentProfile?.hobbies?.map((hobby, index) => (
              <View key={index} className="px-4 py-2 rounded-xl bg-gray-100">
                <Text className="text-gray-800 font-medium">{hobby}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sign Out Button */}
        <View className="mt-8">
          <Button
            variant="destructive"
            size="lg"
            className="w-full"
            onPress={() => signOut()}
          >
            <Text className="text-white font-medium">Cerrar sesión</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
