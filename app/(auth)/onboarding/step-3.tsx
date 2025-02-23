import { ThemedText } from "@/components/ThemedText";
import { OnBoardingLayout } from "@/components/OnBoardingLayout";
import { useThemeColor } from "@/hooks/useThemeColor";
import { generalStyles } from "@/styles";
import React from "react";
import { View, Text, Dimensions } from "react-native";

export default function OnboardingStepTwo() {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const primary2 = useThemeColor({}, "primary2");

  return (
    <OnBoardingLayout
      nextBgColor={bg}
      nextTextColor={text}
      bgColor={primary2}
      nextText="START"
      nextHref="/onboarding/welcome"
    >
      <View style={generalStyles.container}>
        <View style={generalStyles.textContainer}>
          <Text style={[generalStyles.text, generalStyles.titleBold]}>
            Seamless Animations
          </Text>
          <Text style={[generalStyles.text, generalStyles.description]}>
            Bringing your onboarding to life with smooth transitions.
          </Text>
        </View>
      </View>
    </OnBoardingLayout>
  );
}
