import "~/global.css";

import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import NetInfo from "@react-native-community/netinfo";
import {
  DMSans_400Regular,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalHost } from "@rn-primitives/portal";
import { router, Slot, SplashScreen, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, useWindowDimensions } from "react-native";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { toast, Toaster } from "sonner-native";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [fontsLoaded] = useFonts({ DMSans_400Regular, DMSans_700Bold });
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const width = useWindowDimensions().width;
  const isMobile = width < 768;
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded || !fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <ClerkLoaded>
          <GestureHandlerRootView>
            <RootLayoutNav />
            <Toaster style={{
              width: isMobile ? "100%" : "50%",
              marginHorizontal: isMobile ? 0 : "auto"
            }} />
          </GestureHandlerRootView>
        </ClerkLoaded>
        <PortalHost />
      </ThemeProvider>
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const { isLoaded, isSignedIn } = useAuth();

  const segments = useSegments();

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        toast.error("No tienes conexión a internet", {
          description: "Verifica que tengas conexión a internet",
        });
      }
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (!isSignedIn && segments[0] === "(screens)") {
      router.push("/(auth)/onboarding/auth/sign-in");
    } else if (isSignedIn && segments[0] === "(auth)") {
      router.push("/(screens)");
    }
  }, [isLoaded, isSignedIn, segments]);

  return <Slot />;
}
