import { OnBoardingLayout } from "@/components/OnBoardingLayout";
import { useThemeColor } from "@/hooks/useThemeColor";
import { generalStyles } from "@/styles";
import React from "react";
import { View, Text, Dimensions } from "react-native";

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
        <View style={generalStyles.textContainer}>
          <Text style={[generalStyles.text, generalStyles.titleBold]}>
            Expo Router Navigation
          </Text>
          <Text style={[generalStyles.text, generalStyles.description]}>
            Handles screen transitions smoothly in the onboarding flow.
          </Text>
        </View>
      </View>
    </OnBoardingLayout>
  );
}
