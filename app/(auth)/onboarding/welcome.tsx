import { ThemedText } from "@/components/ThemedText";
import { OnBoardingLayout } from "@/components/OnBoardingLayout";
import { useThemeColor } from "@/hooks/useThemeColor";
import { generalStyles } from "@/styles";
import React from "react";
import { View, Dimensions } from "react-native";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";

export default function OnboardingStepTwo() {
  const bg = useThemeColor({}, "background");

  return (
    <OnBoardingLayout nextBgColor={bg} bgColor={bg} complete>
      <View style={generalStyles.container}>
        <View style={generalStyles.textContainer}>
          <ThemedText
            style={[
              generalStyles.text,
              generalStyles.titleBold,
              {
                textAlign: "center",
              },
            ]}
          >
            You're In!
          </ThemedText>
          <ThemedText
            style={[
              generalStyles.text,
              generalStyles.description,
              { textAlign: "center" },
            ]}
          >
            Everything's ready. Start building with React Native now.
          </ThemedText>
          <Button
            onPress={() => router.push("/(auth)/onboarding/sign-in")}
            size="lg"
            className="rounded-full mt-8"
          >
            <Text className="font-semibold">Empezar</Text>
          </Button>
        </View>
      </View>
    </OnBoardingLayout>
  );
}
