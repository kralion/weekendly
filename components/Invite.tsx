import { useUser } from "@clerk/clerk-expo";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Search, X } from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { useProfiles } from "~/stores";
import { useInvitations } from "~/stores/useInvitations";
import { Profile } from "~/types";
import { toast } from "sonner-native";

export default function InviteBottomSheet({
  bottomSheetRef,
  id,
}: {
  bottomSheetRef: React.RefObject<BottomSheet>;
  id: string;
}) {
  const snapPoints = useMemo(() => ["55%"], []);
  const { isDarkColorScheme: isDarkMode } = useColorScheme();
  const [message, setMessage] = React.useState<string>("");
  const { createInvitation, loading: invitationsLoading } = useInvitations();
  const [searchText, setSearchText] = React.useState<string>("");
  const { user } = useUser();
  const [searchResults, setSearchResults] = React.useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<Profile | null>(null);
  const { searchProfilesByUsername, loading } = useProfiles();

  const handleSearchProfile = useCallback(
    async (username: string) => {
      if (!username.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const results = await searchProfilesByUsername(username);
        setSearchResults(results);
      } catch (error) {
        console.error(error);
        toast.error("Error al buscar usuarios");
      }
    },
    [searchProfilesByUsername]
  );

  const handleSelectUser = useCallback((profile: Profile) => {
    setSelectedUser(profile);
    setSearchText("");
    setSearchResults([]);
  }, []);

  const handleRemoveUser = useCallback(() => {
    setSelectedUser(null);
    setSearchText("");
    setSearchResults([]);
  }, []);

  const handleInvite = useCallback(async () => {
    if (!selectedUser) {
      toast.error("Selecciona un usuario para invitar");
      return;
    }

    await createInvitation({
      sender_id: user?.id as string,
      plan_id: id,
      receiver_id: selectedUser.user_id,
      message,
      created_at: new Date(),
    });

    // Clear form and close
    setSearchText("");
    setSelectedUser(null);
    setMessage("");
    bottomSheetRef.current?.close();
  }, [selectedUser, user?.id, id, message, createInvitation]);

  // Debounced search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearchProfile(searchText);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText, handleSearchProfile]);

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
        setSearchText("");
        setSelectedUser(null);
        setSearchResults([]);
        setMessage("");
      }}
    >
      <BottomSheetView className="p-4 flex flex-col gap-4">
        <Text className="font-bold text-3xl">Invitar</Text>

        <View className="flex flex-col gap-2">
          <Text style={{ color: "gray" }}>Nombre de usuario</Text>
          <View className="flex-row items-center gap-4">
            {selectedUser ? (
              <View className="flex-1 flex-row items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-gray-200 dark:border-zinc-700">
                <Text className="font-medium">{selectedUser.username}</Text>
                <TouchableOpacity onPress={handleRemoveUser}>
                  <X size={20} color={isDarkMode ? "white" : "black"} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <BottomSheetTextInput
                  className="border rounded-lg border-gray-200 p-4 flex-1 dark:border-zinc-700 text-black dark:text-white"
                  placeholder="Ej. usuario123"
                  value={searchText}
                  onChangeText={setSearchText}
                />
                {loading && (
                  <ActivityIndicator color={isDarkMode ? "white" : "black"} />
                )}
              </>
            )}
          </View>

          {!selectedUser && searchResults.length > 0 && (
            <View className="mt-2">
              {searchResults.map((profile) => (
                <TouchableOpacity
                  key={profile.user_id}
                  className="py-3 px-4 border-b border-gray-100 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700"
                  onPress={() => handleSelectUser(profile)}
                >
                  <Text className="font-medium">{profile.username}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={{ color: "gray" }} className="mt-2">
            Mensaje
          </Text>
          <View className="flex-row items-center ">
            <BottomSheetTextInput
              className="border rounded-lg border-gray-200 p-4 flex-1 dark:border-zinc-700 text-black dark:text-white"
              placeholder="Escribe ..."
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
          disabled={!selectedUser}
        >
          {invitationsLoading ? (
            <ActivityIndicator color={isDarkMode ? "white" : "black"} />
          ) : (
            <Text>Invitar</Text>
          )}
        </Button>
      </BottomSheetView>
    </BottomSheet>
  );
}
