import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Camera, X } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { MultiSelect } from "~/components/ui/multi-select";
import { Select, SelectItem } from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { ProfileSchema, profileSchema } from "~/schemas";
import { useProfiles } from "~/stores";
import { Gender } from "~/types";

const HOBBIES_OPTIONS = [
  "Deportes",
  "Música",
  "Arte",
  "Lectura",
  "Viajes",
  "Cocina",
  "Fotografía",
  "Cine",
  "Teatro",
  "Danza",
];

const LANGUAGES = ["Español", "Ingles", "Portugues", "Aleman", "Italiano"];

export default function EditProfileScreen() {
  const { user } = useUser();
  const { currentProfile, updateProfile, createProfile } = useProfiles();
  const [isLoading, setIsLoading] = React.useState(false);
  const [image_url, setImage_url] = React.useState<string>(
    user?.imageUrl || ""
  );
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      opacity: withTiming(scrollY.value > 50 ? 1 : 0),
    };
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      user_id: user?.id || "",
      username: currentProfile?.username || user?.fullName || "",
      bio: currentProfile?.bio || "",
      phone: currentProfile?.phone || "",
      gender: currentProfile?.gender as Gender,
      country: currentProfile?.country || "",
      languages: currentProfile?.languages || [],
    },
  });
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
        return data.secure_url;
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
  };
  const onSubmit = async (data: ProfileSchema) => {
    if (!user) return;

    try {
      if (currentProfile) {
        await updateProfile(user.id, {
          ...data,
          image_url,
          gender: data.gender[0] as Gender,
        });
      } else {
        await createProfile({
          ...data,
          image_url,
          gender: data.gender[0] as Gender,
        });
      }
      router.back();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      {/* Header */}
      <Animated.View style={headerStyle}>
        <BlurView className="px-6 py-4 flex-row items-center">
          <Button
            className="rounded-full"
            onPress={() => router.back()}
            variant="secondary"
            size="icon"
          >
            <X size={20} color="#A020F0" />
          </Button>
          <Text className="text-xl font-semibold ml-4">Editar perfil</Text>
        </BlurView>
      </Animated.View>
      <Animated.ScrollView
        className="flex-1 p-6 bg-background"
        contentContainerClassName="pb-10"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View className="flex-row items-center mb-8 mx-auto">
          <View className="relative">
            <Image
              source={{ uri: image_url }}
              className="w-36 h-36 rounded-full overflow-hidden"
              style={{ opacity: isLoading ? 0.5 : 1 }}
            />
            {isLoading && (
              <View className="absolute inset-0 flex items-center justify-center">
                <ActivityIndicator size="large" color="#A020F0" />
              </View>
            )}
            <Button
              variant="secondary"
              size="icon"
              className="bg-white rounded-full p-1 absolute bottom-0 right-0"
              onPress={() => pickImage()}
              disabled={isLoading}
            >
              <Camera size={20} color="#A020F0" />
            </Button>
          </View>
        </View>

        <View className="flex flex-col gap-6">
          <View>
            <Text className="font-medium mb-2">Nombre de usuario</Text>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
                  className="bg-white"
                  onChangeText={onChange}
                  placeholder="Tu nombre de usuario"
                />
              )}
            />
            {errors.username?.message && (
              <Text className="text-xs text-red-500">
                {errors.username?.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="font-medium mb-2">Bio</Text>
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, value } }) => (
                <Textarea
                  value={value || ""}
                  onChangeText={onChange}
                  className="bg-white"
                  placeholder="Cuéntanos sobre ti..."
                />
              )}
            />
            {errors.bio?.message && (
              <Text className="text-xs text-red-500">
                {errors.bio?.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="font-medium mb-2">Género</Text>
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <Select
                  value={{
                    label: value,
                    value,
                  }}
                  defaultValue={{
                    value: currentProfile?.gender as Gender,
                    label: currentProfile?.gender as string,
                  }}
                  className="bg-white rounded-lg px-2 py-3"
                  onValueChange={(option) => onChange(option?.value)}
                >
                  <SelectItem value="hombre" label="Hombre">
                    Hombre
                  </SelectItem>
                  <SelectItem value="mujer" label="Mujer">
                    Mujer
                  </SelectItem>
                  <SelectItem value="otro" label="Otro">
                    Otro
                  </SelectItem>
                </Select>
              )}
            />
            {errors.gender?.message && (
              <Text className="text-xs text-red-500">
                {errors.gender?.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="font-medium mb-2">Ubicación</Text>
            <Controller
              control={control}
              name="country"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value || ""}
                  className="bg-white"
                  onChangeText={onChange}
                  placeholder="Tu lugar de residencia "
                />
              )}
            />
            {errors.country?.message && (
              <Text className="text-xs text-red-500">
                {errors.country?.message}
              </Text>
            )}
          </View>
          <View>
            <Text className="font-medium mb-2">Idiomas</Text>
            <Controller
              control={control}
              name="languages"
              render={({ field: { onChange, value } }) => (
                <MultiSelect
                  options={LANGUAGES}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            {errors.languages?.message && (
              <Text className="text-xs text-red-500">
                {errors.languages?.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="font-medium mb-2">Pasatiempos</Text>
            <Controller
              control={control}
              name="hobbies"
              render={({ field: { onChange, value } }) => (
                <MultiSelect
                  options={HOBBIES_OPTIONS}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            {errors.hobbies?.message && (
              <Text className="text-xs text-red-500">
                {errors.hobbies?.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="font-medium mb-2">Teléfono</Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value || ""}
                  className="bg-white"
                  onChangeText={onChange}
                  placeholder="Tu teléfono"
                  keyboardType="phone-pad"
                />
              )}
            />
            {errors.phone?.message && (
              <Text className="text-xs text-red-500">
                {errors.phone?.message}
              </Text>
            )}
          </View>

          <Button onPress={handleSubmit(onSubmit)} className="mt-4" size="lg">
            <Text className="text-white">
              {currentProfile ? "Actualizar perfil" : "Crear perfil"}
            </Text>
          </Button>
        </View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}
