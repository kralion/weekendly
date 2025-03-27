import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { useComments } from "~/stores/comments";
import { toast } from "sonner-native";
import { useColorScheme } from "~/lib/useColorScheme";

interface AddCommentProps {
  planId: string;
  userId: string;
  bottomSheetRef: React.RefObject<BottomSheet>;
}

export default function AddComment({
  planId,
  userId,
  bottomSheetRef,
}: AddCommentProps) {
  const [comment, setComment] = React.useState("");
  const { isDarkColorScheme: isDarkMode } = useColorScheme();
  const { createComment, isLoading } = useComments();
  const snapPoints = useMemo(() => ["40%"], []);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      await createComment({
        plan_id: planId,
        user_id: userId,
        message: comment.trim(),
      });

      setComment("");
      bottomSheetRef.current?.close();
      toast.success("¡Comentario añadido con éxito!");
    } catch (error) {
      toast.error("No se pudo añadir el comentario");
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
      backgroundStyle={{ backgroundColor: isDarkMode ? "#262626" : "white" }}
    >
      <BottomSheetView className="flex-1 gap-4 p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Añadir comentario</Text>
        </View>

        <BottomSheetTextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Escribe tu comentario aquí..."
          multiline={true}
          className="border rounded-lg border-gray-200 p-4 flex-1 dark:border-zinc-700 text-black dark:text-white"
        />

        <View className="flex-row justify-end mb-4">
          <Button
            onPress={handleSubmit}
            disabled={!comment.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text>Publicar</Text>
            )}
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
