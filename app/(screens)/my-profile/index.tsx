import { useAuth, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  Camera,
  Check,
  CheckCircle,
  ChevronLeft,
  Globe,
  MapPin,
  Moon,
  Settings2,
  Sun,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Appearance,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { supabase } from "~/lib/supabase";
import { useColorScheme } from "~/lib/useColorScheme";
import { generateAPIUrl } from "~/lib/utils";
import { useProfiles } from "~/stores";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [feedbackText, setFeedbackText] = React.useState("");
  const [isSendingFeedback, setIsSendingFeedback] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { currentProfile, loading, fetchProfileById, updateProfile } = useProfiles();
  const [bio, setBio] = React.useState(currentProfile?.bio || "");
  const [phone, setPhone] = React.useState(currentProfile?.phone || "");
  const [ig_username, setIg_username] = React.useState(currentProfile?.ig_username || "");
  const [image_url, setImage_url] = React.useState<string>(
    currentProfile?.image_url || ""
  );

  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? 'light' : 'dark';
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
  }

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
        const base64ImageData = `data:image/jpeg;base64,${base64Img}`;

        const response = await fetch(generateAPIUrl("/api/cloudinary"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            base64Image: base64ImageData,
            folder: "weekendly/plans",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Upload failed: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        if (data.status === "success") {
          const { error } = await supabase
            .from("profiles")
            .update({
              image_url: data.data.secure_url,
            })
            .eq("user_id", user?.id);
          setImage_url(data.data.secure_url);
          if (error) {
            console.log(error);
          }
        } else {
          throw new Error(data.error || "Failed to upload image");
        }
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Error al subir la imagen");
      } finally {
        setIsLoading(false);
      }
    }
  };


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

  async function handleSendFeedback() {
    if (!feedbackText.trim()) {
      toast.error("Por favor escribe un mensaje de feedback");
      return;
    }

    setIsSendingFeedback(true);

    try {
      const response = await fetch(generateAPIUrl("/api/feedback"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedbackText,
          user: {
            firstName: user?.firstName || "Anonymous",
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send feedback");
      }

      setFeedbackText("");
      toast.success("Feedback enviado con éxito");
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast.error("No se pudo enviar el feedback");
    } finally {
      setIsSendingFeedback(false);
    }
  }

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
          className="p-4 flex-row mt-10 justify-between items-center absolute top-0  right-0  z-10"
        >
          <TouchableOpacity
            onPress={() => router.push(`/(screens)/my-profile/my-plans`)}
            className="w-28 h-10 justify-center items-center bg-black/20 rounded-full"
          >
            <Text className="text-white">Mis Planes</Text>
          </TouchableOpacity>
        </Animated.View>


        {/* Profile Info */}
        <Animated.View
          entering={SlideInUp.duration(800).springify()}
          className="px-6 -mt-16 web:md:w-1/2 web:md:mx-auto "
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
              <Text className="text-2xl font-bold  web:md:text-3xl">
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
            <Text className="text-lg font-semibold mb-2  web:md:text-xl">
              Bio
            </Text>
            <View className="bg-muted p-4 rounded-lg web:md:p-6">
              <TextInput
                value={bio}
                className="dark:text-white"
                onChangeText={(text) => setBio(text)}
                onBlur={() => updateProfile(user?.id as string, { bio })}
              />
            </View>
          </View>
          <View className="mt-8 flex flex-col">
            <Text className="text-lg font-semibold mb-2  web:md:text-xl">
              Teléfono
            </Text>
            <View className="bg-muted p-4 rounded-lg web:md:p-6">
              <TextInput
                value={phone}
                className="dark:text-white"
                onChangeText={(text) => setPhone(text)}
                onBlur={() => updateProfile(user?.id as string, { phone })}
              />
            </View>
          </View>

          {/* Interests/Hobbies */}
          <View className="mt-8">
            <Text className="text-lg font-semibold mb-4  web:md:text-xl">
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
          <View className="mt-8 flex flex-col gap-2">

            <View className="flex-row items-center gap-4 ">
              <View className="flex flex-col gap-2">
                <View className="flex flex-col">

                  <Text className="text-lg font-semibold mr-2  web:md:text-xl">
                    Tu Instagram
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    Para que se animen a hacer más planes contigo
                  </Text>
                </View>
                <View className="flex-row justify-between items-center gap-4">

                  <View className="bg-muted p-4 rounded-lg web:md:p-6 w-full">
                    <TextInput
                      placeholder="@usuario"
                      className="dark:text-white"
                      value={ig_username}
                      onChangeText={(text) => setIg_username(text)}
                      onBlur={() => updateProfile(user?.id as string, { ig_username: `https://www.instagram.com/${ig_username}` })}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-8">
            <Text className="text-lg font-semibold mb-4  web:md:text-xl">
              Apariencia
            </Text>
            <View className="bg-muted p-4 rounded-lg web:md:p-6 flex flex-row justify-between items-center">
              <Text className=" web:md:text-base">
                {isDarkColorScheme ? "Modo Oscuro" : "Modo Claro"}
              </Text>

              <Button
                size="icon"
                variant="secondary"
                className=" rounded-full"
                onPress={toggleColorScheme}
              >
                {isDarkColorScheme ? (
                  <Sun size={20} color="#FF5733" />
                ) : (
                  <Moon size={20} color="#FF5733" />
                )}
              </Button>
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
              <Text className=" font-medium web:md:text-base">
                Cerrar sesión
              </Text>
            </Button>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
