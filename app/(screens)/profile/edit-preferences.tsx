import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { MultiSelect } from "~/components/ui/multi-select";
import { RangeSlider } from "~/components/ui/range-slider";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { useUserPreferencesStore } from "~/stores";

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

const ACTIVITIES_OPTIONS = [
  "Restaurantes",
  "Cafés",
  "Bares",
  "Parques",
  "Museos",
  "Cine",
  "Teatro",
  "Conciertos",
  "Deportes",
  "Excursiones",
];

const DAYS_OPTIONS: Array<{ label: string; value: "saturday" | "sunday" }> = [
  { label: "Sábado", value: "saturday" },
  { label: "Domingo", value: "sunday" },
];

const TIME_RANGES = [
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
];

export default function EditPreferencesScreen() {
  const { user } = useUser();
  const { preferences, updatePreferences } = useUserPreferencesStore();

  const [formData, setFormData] = useState({
    bio: preferences?.bio || "",
    hobbies: preferences?.hobbies || [],
    preferred_activities: preferences?.preferred_activities || [],
    age_range: preferences?.age_range || ([18, 35] as [number, number]),
    preferred_days: preferences?.preferred_days || [],
    preferred_time_ranges: preferences?.preferred_time_ranges || [],
    preferred_place_types: preferences?.preferred_place_types || [],
  });

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await updatePreferences(user.id, formData);
      router.back();
    } catch (error) {
      console.error("Error updating preferences:", error);
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
            <Text className="font-medium mb-2">Bio</Text>
            <Textarea
              value={formData.bio || ""}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, bio: text }))
              }
              placeholder="Cuéntanos sobre ti..."
            />
          </View>

          <View>
            <Text className="font-medium mb-2">Hobbies</Text>
            <MultiSelect
              options={HOBBIES_OPTIONS}
              value={formData.hobbies}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, hobbies: selected }))
              }
            />
          </View>

          <View>
            <Text className="font-medium mb-2">Actividades preferidas</Text>
            <MultiSelect
              options={ACTIVITIES_OPTIONS}
              value={formData.preferred_activities}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  preferred_activities: selected,
                }))
              }
            />
          </View>

          <View>
            <Text className="font-medium mb-2">Rango de edad (años)</Text>
            <RangeSlider
              range={formData.age_range as [number, number]}
              min={18}
              max={60}
              onChange={(range) =>
                setFormData((prev) => ({ ...prev, age_range: range }))
              }
            />
          </View>

          <View>
            <Text className="font-medium mb-2">Días preferidos</Text>
            <MultiSelect<"saturday" | "sunday">
              options={DAYS_OPTIONS}
              value={formData.preferred_days}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, preferred_days: selected }))
              }
              placeholder="Selecciona los días..."
            />
          </View>

          <View>
            <Text className="font-medium mb-2">Horarios preferidos</Text>
            <MultiSelect
              options={TIME_RANGES}
              value={formData.preferred_time_ranges}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  preferred_time_ranges: selected,
                }))
              }
              placeholder="Selecciona los horarios..."
            />
          </View>

          <View>
            <Text className="font-medium mb-2">Lugares preferidos</Text>
            <MultiSelect
              options={ACTIVITIES_OPTIONS}
              value={formData.preferred_place_types}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  preferred_place_types: selected,
                }))
              }
              placeholder="Selecciona los lugares..."
            />
          </View>

          <Button onPress={handleSubmit} className="mt-4" size="lg">
            <Text>Guardar preferencias</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
