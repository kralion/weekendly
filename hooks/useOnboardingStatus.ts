import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { toast } from "sonner-native";

const ONBOARDING_COMPLETED_KEY = "onboardingCompleted";

export function useOnboardingStatus() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
    boolean | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load onboarding status on mount
  useEffect(() => {
    const loadOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        setIsOnboardingCompleted(value === "true");
      } catch (error) {
        console.error("Error loading onboarding status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOnboardingStatus();
  }, []);

  // Function to mark onboarding as completed
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
      setIsOnboardingCompleted(true);
      return true;
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      toast.error("Error saving onboarding status");
      return false;
    }
  };

  // Function to reset onboarding status (for testing)
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      setIsOnboardingCompleted(false);
      return true;
    } catch (error) {
      console.error("Error resetting onboarding status:", error);
      return false;
    }
  };

  return {
    isOnboardingCompleted,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  };
}
