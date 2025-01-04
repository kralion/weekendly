import { useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function Home() {
  const { signOut } = useAuth();
  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/two.tsx" title="Tab Two" />
      </View>
      <Button onPress={() => signOut()}>
        <Text>Sign Out</Text>
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
