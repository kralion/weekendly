import { router, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ScreenContent } from '~/components/ScreenContent';
import { useUser } from '@clerk/clerk-expo';

export default function Home() {
  const { user, isSignedIn } = useUser();
  if (!isSignedIn) {
    router.replace('/(auth)/sign-in');
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Tab One' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/index.tsx" title="Tab One" />
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
