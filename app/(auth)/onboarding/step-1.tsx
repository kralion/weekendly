import { OnBoardingLayout } from "@/components/OnBoardingLayout";
import { useThemeColor } from "@/hooks/useThemeColor";
import { generalStyles } from "@/styles";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function OnboardingStepOne() {
  const primary1 = useThemeColor({}, "primary1");
  return (
    <OnBoardingLayout nextBgColor={primary1} nextHref="/onboarding/step-2">
      <View style={generalStyles.container}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1506782081254-09bcfd996fd6?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZyaWVuZHN8ZW58MHx8MHx8fDA%3D",
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
          <Text className="text-4xl font-bold text-center">Weekendly</Text>

          <Text className="text-center text-xl">
            Conecta con gente que comparten tus intereses y descubre planes y
            eventos cerca de ti.
          </Text>
        </View>
      </View>
    </OnBoardingLayout>
  );
}
