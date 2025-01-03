import { useOAuth, useSignUp } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { Link, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// import { TermsPolicyModal } from '~/components/auth/terms&policy';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      void WebBrowser.warmUpAsync();
    }

    return () => {
      if (Platform.OS !== 'web') {
        void WebBrowser.coolDownAsync();
      }
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { signUp, setActive } = useSignUp();
  const [showTCModal, setShowTCModal] = React.useState(false);
  const router = useRouter();

  return (
    <ScrollView>
      <SafeAreaView className="flex h-[100vh] flex-col items-center justify-center p-4 align-middle web:m-4">
        <View className="h-screen-safe flex flex-col justify-center gap-12">
          <View className="flex flex-col items-center gap-1">
            <Image
              style={{
                width: 225,
                height: 225,
              }}
              source={require('../../assets/logo.png')}
            />
            <Text className="text-4xl font-bold"> Crea una cuenta</Text>
            <View className="flex flex-row gap-1.5">
              <Text>Ya tienes una cuenta?</Text>

              <Text className="text-primary active:underline" onPress={() => router.back()}>
                Inicia Sesión
              </Text>
            </View>
          </View>

          <View className="flex flex-col gap-4">
            <SignInWithOAuthGoogle />
            <SignInWithOAuthFacebook />
            <SignInWithOAuthTiktok />
          </View>
          <View className="flex w-full  flex-col">
            <Text className=" text-sm ">
              Al continuar aceptas las politicas de privacidad y demas clausulas , en estos se
              describen como usamos tus datos y como protegemos tu privacidad.
            </Text>
            {/* <TermsPolicyModal /> */}
          </View>
          <View className="absolute -bottom-24 flex w-full flex-row justify-center text-center align-middle ">
            <Text className="text-sm ">
              Copyright @ {new Date().getFullYear()} Weekendly | Desarrollado por
            </Text>
            <Text className="text-primary text-sm active:underline">
              <Link href="https://x.com/brayanpaucar_"> Brayan</Link>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

export const SignInWithOAuthGoogle = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)', { scheme: 'roomy' }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  return (
    <Button
      className="flex flex-row items-center gap-2"
      variant="outline"
      size="lg"
      onPress={onPress}>
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: 'https://img.icons8.com/?size=96&id=17949&format=png',
        }}
        alt="google"
      />
      <Text>Continuar con Google</Text>
    </Button>
  );
};
export const SignInWithOAuthTiktok = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_tiktok' });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)', { scheme: 'roomy' }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  return (
    <Button
      className="flex flex-row items-center gap-2"
      variant="outline"
      size="lg"
      onPress={onPress}>
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/128/3046/3046121.png',
        }}
        alt="tiktok"
      />
      <Text>Continuar con TikTok</Text>
    </Button>
  );
};
export const SignInWithOAuthFacebook = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_facebook' });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)', { scheme: 'roomy' }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  return (
    <Button
      className="flex flex-row items-center gap-2"
      variant="outline"
      size="lg"
      onPress={onPress}>
      <Image
        style={{ width: 24, height: 24 }}
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/128/5968/5968764.png',
        }}
        alt="Facebook"
      />
      <Text>Continuar con Facebook</Text>
    </Button>
  );
};
