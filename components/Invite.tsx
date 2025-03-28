import { useUser } from "@clerk/clerk-expo";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { usePlans } from "~/stores";
import { useInvitations } from "~/stores/useInvitations";
import { Plan } from "~/types";

export default function InviteBottomSheet({
  bottomSheetRef,
  id,
}: {
  bottomSheetRef: React.RefObject<BottomSheet>;
  id: string;
}) {
  const snapPoints = useMemo(() => ["30%"], []);
  const { isDarkColorScheme: isDarkMode } = useColorScheme();
  const [message, setMessage] = React.useState<string>("");
  const { createInvitation, loading: invitationsLoading } = useInvitations();
  const [data, setData] = React.useState<Plan | null>(null);
  const { getPlanById } = usePlans();
  const { user } = useUser();

  useEffect(() => {
    if (id) {
      getPlanById(id).then(setData);
    }
  }, [id]);

  const handleInvite = useCallback(async () => {
    if (!user) {
      toast.error("Selecciona un usuario para invitar");
      return;
    }

    await createInvitation({
      sender_id: user?.id as string,
      plan_id: id,
      receiver_id: data?.creator_id as string,
      message,
      created_at: new Date(),
    });
    setMessage("");
    bottomSheetRef.current?.close();
  }, [user?.id, id, message, createInvitation]);



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
      onClose={() => {
        setMessage("");
      }}
    >
      <BottomSheetScrollView
        contentContainerClassName="px-4 flex flex-col gap-4">
        <Text className="font-bold text-3xl">Solicitud</Text>

        <View className="flex flex-col gap-4">
          <View className="flex-row items-center ">
            <BottomSheetTextInput
              className="web:flex min-h-[80px] w-full rounded-md border border-input dark:border-border bg-background px-3 py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground web:ring-offset-background placeholder:text-muted-foreground web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
              placeholder="Mensaje de solicitud ..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <Button
          size="lg"
          className="rounded-full mt-4"
          onPress={handleInvite}
        >
          {invitationsLoading ? (
            <ActivityIndicator color={isDarkMode ? "white" : "black"} />
          ) : (
            <Text>Enviar</Text>
          )}
        </Button>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
