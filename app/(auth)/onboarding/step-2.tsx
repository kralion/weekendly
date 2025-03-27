import { OnBoardingLayout } from "@/components/OnBoardingLayout";
import { useThemeColor } from "@/hooks/useThemeColor";
import { generalStyles } from "@/styles";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

export default function OnboardingStepTwo() {
  const primary1 = useThemeColor({}, "primary1");
  const primary2 = useThemeColor({}, "primary2");

  return (
    <OnBoardingLayout
      nextBgColor={primary2}
      bgColor={primary1}
      nextHref="/onboarding/step-3"
    >
      <View style={generalStyles.container}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <LinearGradient
          colors={[
            "rgba(59, 130, 246, 0.4)",
            "transparent",
            "transparent",
            "rgba(147, 51, 234, 0.4)",
          ]}
          locations={[0, 0.2, 0.8, 1]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
          }}
        />
        <View className="pt-36 px-8 flex flex-col gap-4">
          <Text className="text-4xl font-bold text-center">Crea Planes</Text>

          <Text className="text-center text-xl">
            Organiza y crea planes para que la gente participe, compártelo con
            quienes desees y tener gente para conectar.
          </Text>
        </View>
      </View>
    </OnBoardingLayout>
  );
}
