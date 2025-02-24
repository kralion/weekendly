import { useSignUp } from "@clerk/clerk-expo";
import React from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner-native";
import { router } from "expo-router";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { validateDni } from "~/lib/validateDni";
import { capitalize } from "~/lib/utils";
import { useSignUpStore } from "~/stores/useSignUpStore";
import type { ReniecResponse } from "~/types";

const signUpSchema = z.object({
  dni: z.string().length(8, "El DNI debe tener 8 dígitos"),
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<ReniecResponse | null>(null);
  const { setClerkCredentials } = useSignUpStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const handleDniChange = async (
    value: string,
    onChange: (value: string) => void
  ) => {
    onChange(value);

    if (value.length === 8) {
      const result = await validateDni(value);
      if (result.status === "success" && result.data) {
        setUserInfo(result.data);
      } else {
        toast.error(result.help);
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  };

  const onSubmit = async (data: SignUpForm) => {
    if (!userInfo) {
      toast.error("Por favor, ingresa un DNI válido");
      return;
    }

    try {
      setIsLoading(true);
      setClerkCredentials({
        username: data.username,
        password: data.password,
        firstName: userInfo.nombres ? capitalize(userInfo.nombres) : "",
        lastName: `${
          userInfo.apellidoPaterno ? capitalize(userInfo.apellidoPaterno) : ""
        } ${
          userInfo.apellidoMaterno ? capitalize(userInfo.apellidoMaterno) : ""
        }`,
      });

      router.push("/onboarding/auth/preferences-1");
    } catch (err: any) {
      console.error(err);
      toast.error("Error al guardar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView>
        <View className="flex flex-col gap-8 h-screen-safe justify-center p-6">
          <View className="flex flex-col items-center">
            <Image
              style={{
                width: 125,
                height: 125,
              }}
              source={require("../../../../assets/logo.png")}
            />
            <Text className="text-4xl font-bold">Crear cuenta</Text>
          </View>

          <View className="flex flex-col gap-4 w-full">
            <View>
              <Text className="font-medium mb-2">DNI</Text>
              <Controller
                control={control}
                name="dni"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="12345678"
                    onChangeText={(text) => handleDniChange(text, onChange)}
                    onBlur={onBlur}
                    value={value}
                    size="lg"
                    keyboardType="numeric"
                    maxLength={8}
                  />
                )}
              />
              {errors.dni?.message && (
                <Text className="text-xs text-red-500">
                  {errors.dni?.message}
                </Text>
              )}
              {userInfo && (
                <Text className="text-muted-foreground">
                  {userInfo.nombres} {userInfo.apellidoPaterno}{" "}
                  {userInfo.apellidoMaterno}
                </Text>
              )}
            </View>

            <View>
              <Text className="font-medium mb-2">Nombre de usuario</Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Tu nombre de usuario"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    size="lg"
                    autoCapitalize="none"
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
              <Text className="font-medium mb-2">Contraseña</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="********"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    size="lg"
                    secureTextEntry
                  />
                )}
              />
              {errors.password?.message && (
                <Text className="text-xs text-red-500">
                  {errors.password?.message}
                </Text>
              )}
            </View>
          </View>

          <View className="flex flex-col gap-4">
            <Button
              size="lg"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="white"
                  className="absolute"
                />
              ) : (
                <Text>Continuar</Text>
              )}
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
