import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { MultiSelect } from "~/components/ui/multi-select";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { createProfileSchema } from "~/schemas";
import { useProfiles } from "~/stores";
import type { CreateProfileSchema } from "~/schemas";
import { Input } from "~/components/ui/input";

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

const AGE_RANGE_OPTIONS = ["18-25", "26-35", "36-45", "46-55", "56+"];

const DAY_OPTIONS = [
  { label: "Sábado", value: "Sábado" },
  { label: "Domingo", value: "Domingo" },
];

export default function EditProfileScreen() {
  const { user } = useUser();
  const { currentProfile, updateProfile, createProfile } = useProfiles();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProfileSchema>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      user_id: user?.id || "",
      username: currentProfile?.username || user?.fullName || "",
      bio: currentProfile?.bio || "",
      location: currentProfile?.location || "",
      hobbies: currentProfile?.hobbies || [],
      age_range: currentProfile?.age_range || "18-25",
      day_preferred: currentProfile?.day_preferred || "Sábado",
    },
  });

  const onSubmit = async (data: CreateProfileSchema) => {
    if (!user) return;

    try {
      if (currentProfile) {
        await updateProfile(user.id, data);
      } else {
        await createProfile(data);
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
      <ScrollView className="flex-1 p-4" contentContainerClassName="pb-20">
        <View className="flex flex-col gap-6">
          <View>
            <Text className="font-medium mb-2">Nombre de usuario</Text>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value}
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
            <Text className="font-medium mb-2">Ubicación</Text>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <Input
                  value={value || ""}
                  onChangeText={onChange}
                  placeholder="Tu ubicación"
                />
              )}
            />
            {errors.location?.message && (
              <Text className="text-xs text-red-500">
                {errors.location?.message}
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
            <Text className="font-medium mb-2">Rango de edad</Text>
            <Controller
              control={control}
              name="age_range"
              render={({ field: { onChange, value } }) => (
                <MultiSelect
                  options={AGE_RANGE_OPTIONS}
                  value={[value]}
                  onChange={(selected) => onChange(selected[0])}
                />
              )}
            />
            {errors.age_range?.message && (
              <Text className="text-xs text-red-500">
                {errors.age_range?.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="font-medium mb-2">Día preferido</Text>
            <Controller
              control={control}
              name="day_preferred"
              render={({ field: { onChange, value } }) => (
                <MultiSelect
                  options={DAY_OPTIONS}
                  value={[value]}
                  onChange={(selected) => onChange(selected[0])}
                />
              )}
            />
            {errors.day_preferred?.message && (
              <Text className="text-xs text-red-500">
                {errors.day_preferred?.message}
              </Text>
            )}
          </View>

          <Button onPress={handleSubmit(onSubmit)} className="mt-4" size="lg">
            <Text className="text-white">
              {currentProfile ? "Actualizar perfil" : "Crear perfil"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
