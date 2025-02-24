import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import {
  Camera,
  CheckCircle,
  ChevronLeft,
  Globe,
  MapPin,
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
import { Text } from "~/components/ui/text";
import { useProfiles } from "~/stores";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [image_url, setImage_url] = React.useState<string>(
    user?.imageUrl || ""
  );
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.canceled) {
      try {
        setIsLoading(true);
        const base64Img = result.assets[0].base64;
        const formData = new FormData();
        formData.append("file", `data:image/jpeg;base64,${base64Img}`);
        formData.append("upload_preset", "ml_default");
        formData.append("folder", "weekendly/plans");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/diqe1byxy/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setImage_url(data.secure_url);
        setIsLoading(false);
        user?.setProfileImage(data.secure_url);
        return data.secure_url;
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
  };

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
        <ActivityIndicator size="large" color="#FF5733" />
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
          <View className="relative">
            <Image
              source={{ uri: image_url }}
              className="w-32 h-32 rounded-full overflow-hidden"
              style={{ opacity: isLoading ? 0.8 : 1 }}
            />
            {isLoading && (
              <View className="absolute inset-0 flex items-center justify-center">
                <ActivityIndicator size="large" color="#FF5733" />
              </View>
            )}
            <Button
              size="icon"
              className="bg-white rounded-full p-1 absolute bottom-0 right-0"
              variant="outline"
              onPress={() => pickImage()}
              disabled={isLoading}
            >
              <Camera size={20} color="#FF5733" />
            </Button>
          </View>
        </View>

        {/* Name and Verification */}
        <View className="mt-4 flex flex-col justify-center items-center">
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-2xl font-bold text-gray-900">
              {user?.firstName?.split(" ")[0]} {user?.lastName?.split(" ")[0]}
            </Text>
            <CheckCircle size={20} color="#1DA1F2" />
          </View>
        </View>

        <View className="flex flex-row gap-4 mx-auto mt-2">
          <View className="flex flex-row gap-1 items-center">
            <MapPin size={18} color="gray" />
            <Text className="text-gray-500 mt-1">
              {currentProfile?.residency}
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
        <View className="mt-8 flex flex-col ">
          <Text className="text-lg font-semibold mb-2 text-gray-900">Bio</Text>
          <View className="bg-muted p-4 rounded-lg">
            <Text className="text-muted-foreground">{currentProfile?.bio}</Text>
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
            className=" rounded-full"
            onPress={() => signOut()}
          >
            <Text className="text-white font-medium">Cerrar sesión</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
