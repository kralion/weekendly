import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    if (Platform.OS !== "web") {
      void WebBrowser.warmUpAsync();
    }

    return () => {
      if (Platform.OS !== "web") {
        void WebBrowser.coolDownAsync();
      }
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  return (
    <ImageBackground
      source={require("../../assets/images/mesh-gradient.png")}
      style={styles.backgroundImage}
    >
      <ScrollView>
        <View
          style={styles.container}
          className="flex flex-col gap-20 h-screen-safe justify-center px-4"
        >
          <View className="flex flex-col items-center gap-3">
            <Image
              style={{
                width: 125,
                height: 125,
              }}
              source={require("../../assets/logo.png")}
            />
            <Text className="text-4xl font-bold">Bienvenido</Text>
            <Text className="text-center px-14">
              Inicia sesión con una de tus cuentas para empezar a usar{" "}
              <Text className=" font-semibold">Weekendly</Text>
            </Text>
          </View>
          <View className="flex flex-col gap-4 justify-center align-middle w-full">
            <SignInWithOAuthGoogle />
            <SignInWithOAuthFacebook />
            <SignInWithOAuthTiktok />
          </View>
          <View>
            <Text className="text-center">
              Al inciar sesión aceptas nuestros{" "}
              <Text className="text-primary font-semibold underline">
                Términos y condiciones
              </Text>{" "}
              y nuestra{" "}
              <Text className="text-primary font-semibold underline">
                Política de Privacidad
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
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

export const SignInWithOAuthGoogle = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)", { scheme: "side" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <Button
      className="flex flex-row gap-2 items-center"
      size="lg"
      onPress={onPress}
    >
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: "https://img.icons8.com/?size=96&id=17949&format=png",
        }}
        alt="google"
      />
      <Text>Continuar con Google</Text>
    </Button>
  );
};
export const SignInWithOAuthTiktok = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_tiktok" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)", { scheme: "side" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <Button
      className="flex flex-row gap-2 items-center"
      variant="secondary"
      size="lg"
      onPress={onPress}
    >
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: "https://cdn-icons-png.flaticon.com/128/3046/3046121.png",
        }}
        alt="tiktok"
      />
      <Text>Continuar con TikTok</Text>
    </Button>
  );
};
export const SignInWithOAuthFacebook = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)", { scheme: "side" }),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <Button
      className="flex flex-row gap-2 items-center"
      variant="secondary"
      size="lg"
      onPress={onPress}
    >
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: "https://cdn-icons-png.flaticon.com/128/5968/5968764.png",
        }}
        alt="Facebook"
      />
      <Text>Continuar con Facebook</Text>
    </Button>
  );
};
