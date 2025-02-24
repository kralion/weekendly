import React from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import { z } from "zod";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { useSignUpStore } from "~/stores/useSignUpStore";
import { useProfiles } from "~/stores/useProfiles";
import { Gender } from "~/types";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import { ChevronLeft } from "lucide-react-native";

const LANGUAGES = [
  "Inglés",
  "Español",
  "Chino mandarín",
  "Hindi",
  "Árabe",
] as const;

const preferencesSchema = z.object({
  residency: z.string().min(1, "La ubicación es requerida"),
  languages: z.array(z.string()).min(1, "Selecciona al menos un idioma"),
  phone: z
    .string()
    .length(9, "El número debe tener 9 dígitos")
    .regex(/^\d+$/, "Solo números permitidos")
    .optional(),
  gender: z.enum(["Hombre", "Mujer", "Otro"] as const, {
    required_error: "Selecciona tu género",
  }),
});

type PreferencesForm = z.infer<typeof preferencesSchema>;

export default function Preferences2Screen() {
  const { bio, hobbies, reset } = useSignUpStore();
  const { createProfile } = useProfiles();
  const { signUp, setActive } = useSignUp();
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>(
    []
  );
  const [selectedGender, setSelectedGender] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      residency: "",
      languages: [],
      phone: "",
      gender: undefined,
    },
  });

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) => {
      const newLanguages = prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language];

      // Update form data
      setValue("languages", newLanguages, { shouldValidate: true });

      return newLanguages;
    });
  };

  const selectGender = (gender: string) => {
    setSelectedGender(gender);
    setValue("gender", gender as "Hombre" | "Mujer" | "Otro", {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: PreferencesForm) => {
    try {
      setIsLoading(true);

      // Get credentials from store
      const { username, password, firstName, lastName } =
        useSignUpStore.getState();

      // Create Clerk user
      const signUpAttempt = await signUp?.create({
        username,
        password,
        firstName,
        lastName,
      });

      if (!signUpAttempt) {
        toast.error("Error al crear la cuenta");
        return;
      }

      if (signUpAttempt.status !== "complete") {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        toast.error("Error al crear la cuenta");
        return;
      }

      await createProfile({
        user_id: signUpAttempt.createdUserId!,
        username,
        bio,
        hobbies,
        residency: data.residency,
        languages: selectedLanguages,
        phone: data.phone || null,
        image_url: null,
        gender: data.gender as Gender,
      });

      await setActive?.({
        session: signUpAttempt.createdSessionId,
      });

      router.replace("/(screens)");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al crear el perfil");
    } finally {
      setIsLoading(false);
    }
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
            <Text className="text-4xl font-bold">Últimos detalles</Text>
            <Text className="text-base text-muted-foreground text-center mt-2 px-10">
              Ya casi terminamos, solo necesitamos algunos datos más
            </Text>
          </View>

          <View className="flex flex-col gap-10">
            <View>
              <Text className="font-medium mb-2 text-muted-foreground">
                ¿Lugar de residencia?
              </Text>
              <Controller
                control={control}
                name="residency"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Ej: Lima, Perú"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.residency?.message && (
                <Text className="text-xs text-red-500">
                  {errors.residency?.message}
                </Text>
              )}
            </View>

            <View>
              <Text className="font-medium mb-2 text-muted-foreground">
                Idiomas que hablas
              </Text>
              <View className="flex flex-row flex-wrap gap-2">
                {LANGUAGES.map((language) => (
                  <Button
                    key={language}
                    variant={
                      selectedLanguages.includes(language)
                        ? "default"
                        : "outline"
                    }
                    onPress={() => toggleLanguage(language)}
                  >
                    <Text>{language}</Text>
                  </Button>
                ))}
              </View>
              {errors.languages?.message && selectedLanguages.length === 0 && (
                <Text className="text-xs text-red-500 mt-2">
                  {errors.languages?.message}
                </Text>
              )}
            </View>

            <View>
              <Text className="font-medium mb-2 text-muted-foreground">
                Género
              </Text>
              <View className="flex flex-row flex-wrap gap-2">
                {["Hombre", "Mujer", "Otro"].map((gender) => (
                  <Button
                    key={gender}
                    variant={selectedGender === gender ? "default" : "outline"}
                    onPress={() => selectGender(gender)}
                  >
                    <Text>{gender}</Text>
                  </Button>
                ))}
              </View>
              {errors.gender?.message && !selectedGender && (
                <Text className="text-xs text-red-500 mt-2">
                  {errors.gender?.message}
                </Text>
              )}
            </View>

            <View>
              <Text className="font-medium mb-2 text-muted-foreground">
                Teléfono (opcional)
              </Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Ingresa tu número de teléfono"
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                    maxLength={9}
                  />
                )}
              />
              {errors.phone?.message && (
                <Text className="text-xs text-red-500">
                  {errors.phone?.message}
                </Text>
              )}
            </View>
          </View>

          <Button
            size="lg"
            onPress={handleSubmit(onSubmit)}
            disabled={
              selectedLanguages.length === 0 || !selectedGender || isLoading
            }
          >
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="white"
                className="absolute"
              />
            ) : (
              <Text>Crear cuenta</Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
