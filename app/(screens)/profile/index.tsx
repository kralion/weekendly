import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Pen,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      className="bg-background"
      contentContainerClassName="pb-10"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
          onPress={() => router.push(`/(screens)/profile/my-plans`)}
          className="w-28 h-10 justify-center items-center bg-black/20 rounded-full"
        >
          <Text className="text-white">Mis Planes </Text>
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
                uri: user?.imageUrl,
              }}
              className="w-full h-full"
            />
          </View>
          <View className="absolute top-0 left-0 w-24 h-24 rounded-full border-2 border-blue-500" />
          <View className="absolute bottom-0 left-16 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
          <Button
            className="rounded-full absolute bottom-3 right-0"
            variant="secondary"
            size="icon"
            onPress={() => router.push("/(screens)/profile/edit")}
          >
            <Pen color="#A020F0" size={18} />
          </Button>
        </View>

        <View className="mt-4 flex-row justify-between items-center">
          <View>
            <View className="flex-row items-center gap-2">
              <Text className="text-xl font-bold">
                {currentProfile?.username || user?.fullName}
              </Text>
              <CheckCircle size={16} color="#1DA1F2" className="ml-1" />
            </View>
          </View>
          <Text className="text-gray-600">
            {currentProfile?.created_at?.split("T")[0]}
          </Text>
        </View>

        <Text className="mt-4 text-gray-800">
          {currentProfile?.bio || "No hay biografía aún"}
        </Text>

        {/* Profile Details Section */}
        <View className="mt-6">
          <Text className="text-lg font-semibold mb-2">Detalles</Text>
          <View className="bg-white rounded-lg shadow-sm">
            <View className="flex-row justify-between items-center p-4">
              <Text className="font-medium">Rango de edad</Text>
              <Text>{currentProfile?.age_range}</Text>
            </View>
            <Separator />

            <View className="flex-row justify-between items-center p-4">
              <Text className="font-medium">Día preferido</Text>
              <Text>{currentProfile?.day_preferred}</Text>
            </View>
            <Separator />

            <View className="flex-row justify-between items-center p-4">
              <Text className="font-medium">Ubicación</Text>
              <Text>{currentProfile?.location || "No especificada"}</Text>
            </View>
          </View>
        </View>

        {/* Hobbies Section */}
        <View className="mt-6">
          <Text className="text-lg font-semibold mb-2">Pasatiempos</Text>
          <View className="flex-row flex-wrap gap-2">
            {currentProfile?.hobbies?.map((hobby, index) => (
              <View key={index} className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-800">{hobby}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sign Out Button */}
        <View className="mt-8">
          <Button
            variant="destructive"
            size="lg"
            onPress={() => {
              signOut();
            }}
          >
            <Text className="text-white">Cerrar sesión</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
