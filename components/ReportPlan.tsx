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
  const snapPoints = useMemo(() => ["45%"], []);

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
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView className="flex-1 p-4 gap-4">
        <View className="flex-row items-center gap-2 mb-4">
          <AlertTriangle size={20} color="#FF5733" />
          <Text className="text-2xl font-bold">Reportar Plan</Text>
        </View>

        <Text className="text-sm text-muted-foreground mb-6">
          Si consideras que este plan es inapropiado o inseguro, puedes
          reportarlo. Nuestro equipo revisará el reporte y tomará las medidas
          necesarias.
        </Text>

        <View className="flex-row justify-end gap-2">
          <Button
            variant="outline"
            onPress={() => bottomSheetRef.current?.close()}
          >
            <Text>Cancelar</Text>
          </Button>
          <Button
            variant="destructive"
            onPress={handleReport}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white">Reportar Plan</Text>
            )}
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
