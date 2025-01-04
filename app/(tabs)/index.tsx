import { useUser } from '@clerk/clerk-expo';
import { router, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenContent } from '~/components/ScreenContent';
import { Text } from '~/components/ui/text';

export default function Home() {
  //FIX: This is creating an empty screen
  const { user, isSignedIn } = useUser();
  // if (!isSignedIn) {
  //   router.replace('/(auth)/sign-in');
  // }

  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/index.tsx" title="Tab One" />
        <Text>Hola {user?.emailAddresses[0].emailAddress}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
