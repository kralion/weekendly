import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { usePlans } from "~/stores";
import { toast } from "sonner-native";
import { AlertTriangle } from "lucide-react-native";
import { useColorScheme } from "~/lib/useColorScheme";

interface ReportPlanProps {
  planId: string;
  bottomSheetRef: React.RefObject<BottomSheet>;
}

export default function ReportPlan({
  planId,
  bottomSheetRef,
}: ReportPlanProps) {
  const { reportPlan } = usePlans();
  const [isLoading, setIsLoading] = React.useState(false);
  const { isDarkColorScheme: isDarkMode } = useColorScheme();

  const snapPoints = useMemo(() => ["40%"], []);

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
      <BottomSheetView className="flex-1 p-4  ">
        <View className="flex-row items-center gap-2 mb-4">
          <AlertTriangle size={20} color="#FF5733" />
          <Text className="text-2xl font-bold">Reportar Plan</Text>
        </View>

        <Text className="text-sm text-muted-foreground mb-6">
          Si consideras que este plan es inapropiado o inseguro, puedes
          reportarlo. Nuestro equipo revisará el reporte y tomará las medidas
          necesarias.
        </Text>

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
            disabled={isLoading}
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
