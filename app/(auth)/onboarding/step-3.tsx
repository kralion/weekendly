import { ThemedText } from "@/components/ThemedText";
import { OnBoardingLayout } from "@/components/OnBoardingLayout";
import { useThemeColor } from "@/hooks/useThemeColor";
import { generalStyles } from "@/styles";
import React from "react";
import { View, Text, Dimensions } from "react-native";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

export default function OnboardingStepTwo() {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const primary2 = useThemeColor({}, "primary2");

  return (
    <OnBoardingLayout
      nextBgColor={bg}
      nextTextColor={text}
      bgColor={primary2}
      nextText="Empezar"
      nextHref="/onboarding/auth/sign-in"
    >
      <View style={generalStyles.container}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGZyaWVuZHN8ZW58MHx8MHx8fDA%3D",
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
          <Text className="text-4xl font-bold text-center text-white">
            Unete a planes
          </Text>

          <Text className="text-center text-xl text-white">
            Puedes unirte a planes que gente ha creado, ir con un amigo tuyo o
            simplemente lanzarte a conocer gente.
          </Text>
        </View>
      </View>
    </OnBoardingLayout>
  );
}
