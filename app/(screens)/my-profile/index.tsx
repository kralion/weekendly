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
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useProfiles } from "~/stores";
import * as ImagePicker from "expo-image-picker";
import { toast } from "sonner-native";
import { Textarea } from "~/components/ui/textarea";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInDown,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const pageId = process.env.EXPO_PUBLIC_NOTION_DATABASE_ID!;
const apiKey = process.env.EXPO_PUBLIC_NOTION_TOKEN!;
export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [feedbackText, setFeedbackText] = React.useState("");
  const [isSendingFeedback, setIsSendingFeedback] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [image_url, setImage_url] = React.useState<string>(
    user?.imageUrl || ""
  );

  const avatarScale = useSharedValue(1);

  const avatarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: avatarScale.value }],
    };
  });

  const handleAvatarPressIn = () => {
    avatarScale.value = withSpring(1.05, { damping: 10, stiffness: 100 });
  };

  const handleAvatarPressOut = () => {
    avatarScale.value = withSpring(1, { damping: 10, stiffness: 100 });
  };

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

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) return;

    try {
      setIsSendingFeedback(true);
      const response = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          parent: { database_id: pageId },
          properties: {
            Name: {
              title: [
                {
                  text: {
                    content: ` ${user?.firstName || "Anonymous"}`,
                  },
                },
              ],
            },
            Message: {
              rich_text: [
                {
                  text: {
                    content: feedbackText,
                  },
                },
              ],
            },
          },
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Notion API Error:", responseData);
      }

      toast.success("¡Feedback enviado con éxito!");
    } catch (error) {
      toast.error("No se pudo enviar el feedback");
    } finally {
      setIsSendingFeedback(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-background"
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
            className="web:md:rounded-b-3xl"
          />
        </View>

        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          className="p-4 flex-row mt-10 justify-between items-center absolute top-0 left-0 right-0 z-10"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(100).duration(500).springify()}
          className="p-4 flex-row mt-10 justify-between items-center absolute top-0 right-0 z-10"
        >
          <TouchableOpacity
            onPress={() => router.push(`/(screens)/my-profile/my-plans`)}
            className="w-28 h-10 justify-center items-center bg-black/20 rounded-full"
          >
            <Text className="text-white">Mis Planes </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Profile Info */}
        <Animated.View
          entering={SlideInUp.duration(800).springify()}
          className="px-6 -mt-16 web:md:max-w-2xl web:md:mx-auto"
        >
          <View className="relative flex items-center">
            <View className="relative">
              <Animated.View style={avatarAnimatedStyle}>
                <Image
                  source={{ uri: image_url }}
                  className="w-32 h-32 rounded-full overflow-hidden web:md:w-40 web:md:h-40"
                  style={{ opacity: isLoading ? 0.8 : 1 }}
                />
              </Animated.View>
              {isLoading && (
                <View className="absolute inset-0 flex items-center justify-center">
                  <ActivityIndicator size="large" color="#FF5733" />
                </View>
              )}
              <Button
                size="icon"
                className="bg-white rounded-full p-1 absolute bottom-0 right-0 web:md:p-2"
                variant="outline"
                onPress={() => pickImage()}
                onPressIn={handleAvatarPressIn}
                onPressOut={handleAvatarPressOut}
                disabled={isLoading}
              >
                <Camera size={20} color="#FF5733" />
              </Button>
            </View>
          </View>

          {/* Name and Verification */}
          <View className="mt-4 flex flex-col justify-center items-center">
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-2xl font-bold text-gray-900 web:md:text-3xl">
                {user?.firstName?.split(" ")[0]} {user?.lastName?.split(" ")[0]}
              </Text>
              <CheckCircle
                size={20}
                color="#1DA1F2"
                className="web:md:w-6 web:md:h-6"
              />
            </View>
          </View>

          <View className="flex flex-row gap-4 mx-auto mt-2">
            <View className="flex flex-row gap-1 items-center">
              <MapPin
                size={18}
                color="gray"
                className="web:md:w-5 web:md:h-5"
              />
              <Text className="text-gray-500 mt-1 web:md:text-base">
                {currentProfile?.residency}
              </Text>
            </View>
            <View className="flex flex-row gap-1 items-center">
              <Globe size={18} color="gray" className="web:md:w-5 web:md:h-5" />
              <Text className="text-gray-500 mt-1 web:md:text-base">
                {currentProfile?.languages?.join(", ")}
              </Text>
            </View>
          </View>
          {/* Social Links */}

          {/* Profile Details Cards */}
          <View className="mt-8 flex flex-col">
            <Text className="text-lg font-semibold mb-2 text-gray-900 web:md:text-xl">
              Bio
            </Text>
            <View className="bg-muted p-4 rounded-lg web:md:p-6">
              <Text className="text-muted-foreground web:md:text-base">
                {currentProfile?.bio}
              </Text>
            </View>
          </View>

          {/* Interests/Hobbies */}
          <View className="mt-8">
            <Text className="text-lg font-semibold mb-4 text-gray-900 web:md:text-xl">
              Intereses
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {currentProfile?.hobbies?.map((hobby, index) => (
                <View
                  key={index}
                  className="px-4 py-2 rounded-xl bg-gray-100 web:md:px-5 web:md:py-3"
                >
                  <Text className="text-gray-800 font-medium web:md:text-base">
                    {hobby}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Feedback Section */}

          <View className="mt-6 flex flex-col gap-4 rounded-lg border border-border bg-card p-2 web:md:p-4">
            <Textarea
              multiline
              numberOfLines={4}
              placeholder="Si tienes algún feedback sobre la app, escríbelo aquí..."
              value={feedbackText}
              onChangeText={setFeedbackText}
              className="web:md:text-base"
            />
            <Button
              disabled={!feedbackText.trim() || isSendingFeedback}
              onPress={handleSendFeedback}
              className="web:md:max-w-xs web:md:self-center"
            >
              {isSendingFeedback ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="web:md:text-base"> Enviar Feedback</Text>
              )}
            </Button>
          </View>

          {/* Sign Out Button */}
          <View className="mt-8">
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full web:md:max-w-xs web:md:mx-auto"
              onPress={() => signOut()}
            >
              <Text className="text-white font-medium web:md:text-base">
                Cerrar sesión
              </Text>
            </Button>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
