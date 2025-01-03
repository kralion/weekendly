import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Image, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Check if the platform is not web before warming up the browser
    if (Platform.OS !== 'web') {
      // Warm up the android browser to improve UX
      void WebBrowser.warmUpAsync();
    }

    return () => {
      // Cool down the browser if it was warmed up
      if (Platform.OS !== 'web') {
        void WebBrowser.coolDownAsync();
      }
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  return (
    <ScrollView>
      <SafeAreaView className="flex h-[100vh] flex-col items-center justify-center p-4 align-middle web:m-4">
        <View className="flex w-full flex-col items-center gap-16">
          <View className="flex flex-col items-center gap-1">
            <Image
              style={{
                width: 225,
                height: 225,
              }}
              source={require('../../assets/logo.png')}
            />
            <Text className="text-4xl font-bold"> Inicia Sesión</Text>
            <Text className="text-center">Para empezar a usar y disfrutar de Weekendly</Text>
          </View>
          <View className="flex w-full flex-col justify-center gap-4 align-middle">
            <SignInWithOAuthGoogle />
            <SignInWithOAuthFacebook />
            <SignInWithOAuthTiktok />
          </View>

          <View className="flex w-full flex-row justify-center gap-2 align-middle">
            <Text className="text-textmuted text-center">¿No tienes una cuenta?</Text>
            <Text
              onPress={() => router.push('/(auth)/sign-up')}
              className="text-primary active:underline">
              Regístrate
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
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)', { scheme: 'weekendly' }),
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
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)', { scheme: 'weekendly' }),
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
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)', { scheme: 'weekendly' }),
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
