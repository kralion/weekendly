import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo } from "react";
import { Image, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { usePlans } from "~/stores";
import { Separator } from "./ui/separator";

export default function PeopleJoinedBottomSheet({
  bottomSheetRef,
  id
}: {
  bottomSheetRef: React.RefObject<BottomSheet>;
  id: string;
}) {
  const snapPoints = useMemo(() => ["55%"], []);
  const { isDarkColorScheme: isDarkMode } = useColorScheme();
  const { participants, getParticipants } = usePlans();

  useEffect(() => {
    getParticipants(id);
  }, [id]);


  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      handleIndicatorStyle={{ backgroundColor: "gray" }}
      backgroundStyle={{ backgroundColor: isDarkMode ? "#262626" : "white" }}
      backdropComponent={renderBackdrop}

    >
      <BottomSheetView className="p-4 flex flex-col gap-4">
        <Text className="font-bold text-3xl">Invitados</Text>
        <View className="flex flex-col gap-2">
          {participants.map((participant) => (
            <View key={participant.user_id} className="flex flex-row items-center gap-2">
              <Image
                source={{ uri: participant.image_url as string }}
                className="w-8 h-8 rounded-full"
              />
              <Text className="font-medium">{participant.username}</Text>
            </View>
          ))}
        </View>
      </BottomSheetView>










    </BottomSheet>
  );
}
