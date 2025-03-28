import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput
} from "@gorhom/bottom-sheet";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { usePlans } from "~/stores";
import { toast } from "sonner-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { Textarea } from "./ui/textarea";

interface ReportPlanProps {
  planId: string;
  bottomSheetRef: React.RefObject<BottomSheet>;
}

export default function ReportPlan({
  planId,
  bottomSheetRef,
}: ReportPlanProps) {
  const { reportPlan } = usePlans();
  const [report, setReport] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { isDarkColorScheme: isDarkMode } = useColorScheme();

  const snapPoints = useMemo(() => ["30%"], []);

  const handleReport = async () => {
    try {
      setIsLoading(true);
      await reportPlan(planId);
      bottomSheetRef.current?.close();
      toast.success("Plan reportado con éxito");
    } catch (error) {
      toast.error("No se pudo reportar el plan");
    } finally {
      setIsLoading(false);
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      handleIndicatorStyle={{ backgroundColor: "gray" }}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: isDarkMode ? "#262626" : "white" }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView className="flex-1 px-4 gap-4  ">
        <Text className="text-2xl font-bold">Reportar Plan</Text>

        <BottomSheetTextInput className="web:flex min-h-[80px] w-full rounded-md border border-input dark:border-border bg-background px-3 py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground web:ring-offset-background placeholder:text-muted-foreground web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
          value={report}
          placeholder="Escribe tu reporte..."
          onChangeText={setReport}
          multiline
        />

        <View className="flex-row gap-4">
          <Button
            className="flex-1"
            size="lg"
            variant="outline"
            onPress={() => bottomSheetRef.current?.close()}
          >
            <Text>Cancelar</Text>
          </Button>
          <Button
            className="flex-1"
            size="lg"
            variant="destructive"
            onPress={handleReport}
            disabled={isLoading || report.length === 0}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white">Reportar</Text>
            )}
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
