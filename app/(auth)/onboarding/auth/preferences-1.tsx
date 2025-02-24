import React from "react";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { useSignUpStore } from "~/stores/useSignUpStore";
import { Textarea } from "~/components/ui/textarea";
import { ChevronLeft } from "lucide-react-native";

const HOBBIES = [
  "Juegos",
  "Deportes",
  "Lectura",
  "Música",
  "Viajes",
  "Cocina",
  "Arte",
  "Fotografía",
  "Películas",
  "Fitness",
] as const;

const preferencesSchema = z.object({
  bio: z.string().min(10, "La biografía debe tener al menos 10 caracteres"),
  hobbies: z.array(z.string()).min(1, "Selecciona al menos un hobby"),
});

type PreferencesForm = z.infer<typeof preferencesSchema>;

export default function Preferences1Screen() {
  const { setPreferences } = useSignUpStore();
  const [selectedHobbies, setSelectedHobbies] = React.useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      bio: "",
      hobbies: [],
    },
  });

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) => {
      const newHobbies = prev.includes(hobby)
        ? prev.filter((h) => h !== hobby)
        : [...prev, hobby];

      // Update form data
      setValue("hobbies", newHobbies, { shouldValidate: true });

      return newHobbies;
    });
  };

  const onSubmit = async (data: PreferencesForm) => {
    setPreferences({
      bio: data.bio,
      hobbies: selectedHobbies,
    });
    router.push("/onboarding/auth/preferences-2");
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="flex flex-col gap-12 p-6">
          <Button
            variant="secondary"
            className="rounded-full"
            size="icon"
            onPress={() => router.back()}
          >
            <ChevronLeft color="orange" size={24} />
          </Button>
          <View className="flex flex-col items-center">
            <Text className="text-4xl font-bold">Cuéntanos sobre ti</Text>

            <Text className="text-base text-muted-foreground text-center mt-2">
              Esto nos ayudará a encontrar planes que te interesen
            </Text>
          </View>

          <View className="flex flex-col gap-10">
            <View>
              <Text className="font-medium mb-2 text-muted-foreground">
                Biografía
              </Text>
              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, value } }) => (
                  <Textarea
                    placeholder="Escribe una breve descripción sobre ti..."
                    onChangeText={onChange}
                    value={value}
                    multiline
                    numberOfLines={4}
                    className="min-h-[100]"
                    textAlignVertical="top"
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
              <Text className="font-medium mb-2 text-muted-foreground">
                Hobbies
              </Text>
              <View className="flex flex-row flex-wrap gap-2">
                {HOBBIES.map((hobby) => (
                  <Button
                    key={hobby}
                    variant={
                      selectedHobbies.includes(hobby) ? "default" : "outline"
                    }
                    onPress={() => toggleHobby(hobby)}
                  >
                    <Text>{hobby}</Text>
                  </Button>
                ))}
              </View>
              {errors.hobbies?.message && selectedHobbies.length === 0 && (
                <Text className="text-xs text-red-500 mt-2">
                  {errors.hobbies?.message}
                </Text>
              )}
            </View>
          </View>

          <Button
            size="lg"
            onPress={handleSubmit(onSubmit)}
            disabled={selectedHobbies.length === 0}
          >
            <Text>Continuar</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
