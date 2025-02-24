import { useSignIn } from "@clerk/clerk-expo";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner-native";
import { OnBoardingLayout } from "~/components/OnBoardingLayout";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { useThemeColor } from "~/hooks/useThemeColor";
import { KeyboardAvoidingView } from "react-native";
import { router } from "expo-router";

const signInSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const bg = useThemeColor({}, "background");
  const [isLoading, setIsLoading] = React.useState(false);
  const { signIn } = useSignIn();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInForm) => {
    try {
      setIsLoading(true);
      const completeSignIn = await signIn?.create({
        password: data.password,
        strategy: "password",
        identifier: data.username,
      });

      if (completeSignIn?.status === "complete") {
        toast.success("¡Bienvenido de vuelta!");
      } else {
        toast.error("Hubo un error al iniciar sesión");
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnBoardingLayout nextBgColor={bg} bgColor={bg} complete>
      <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
        <ScrollView>
          <View
            style={styles.container}
            className="flex flex-col gap-8 h-screen-safe justify-center p-6"
          >
            <View className="flex flex-col items-center">
              <Image
                style={{
                  width: 125,
                  height: 125,
                }}
                source={require("../../../../assets/logo.png")}
              />
              <Text className="text-4xl font-bold">Bienvenido</Text>
              <Text className="text-center text-muted-foreground">
                Inicia sesión en tu cuenta de{" "}
                <Text className="font-semibold">Weekendly</Text>
              </Text>
            </View>

            <View
              className="flex flex-col gap-4
               w-full"
            >
              <View>
                <Text className="font-medium mb-2">Usuario</Text>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Nombre de usuario"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      size="lg"
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
                      size="lg"
                      value={value}
                      secureTextEntry
                      className="bg-white"
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
                  <Text>Iniciar sesión</Text>
                )}
              </Button>

              <View>
                <Text className="text-center text-muted-foreground">
                  ¿Nuevo en Weekendly?{" "}
                  <Text
                    className="text-primary font-semibold underline"
                    onPress={() => router.push("/onboarding/auth/sign-up")}
                  >
                    Crea una cuenta
                  </Text>
                </Text>
              </View>
            </View>
            <View className="mt-10">
              <Text className="text-center text-muted-foreground">
                Al inciar sesión aceptas nuestros{" "}
                <Text className="text-primary font-semibold underline">
                  Términos y condiciones
                </Text>{" "}
                y nuestra{" "}
                <Text className="text-primary font-semibold underline">
                  Política de Privacidad
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </OnBoardingLayout>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
});
