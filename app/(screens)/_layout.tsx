import { Stack } from "expo-router";
import AppProvider from "~/context/provider";

export default function TabLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProvider>
  );
}
