import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  LogOut,
  SmartphoneNfc,
  Unlock,
  User,
  UserSquare2,
} from "lucide-react-native";
import { Linking, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
export default function ProfileScreen() {
  const { user } = useUser();
  const { has, signOut } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={{ paddingTop: 16, height: "100%" }}>
      <View>
        <View className="flex flex-col items-center">
          <Avatar className="bg-teal-500 self-center w-36 h-36" alt="avatar">
            <AvatarImage
              accessibilityLabel="avatar"
              source={{ uri: user?.imageUrl }}
            />
            <AvatarFallback className="rounded-xl bg-slate-500" />
          </Avatar>

          <View className="flex flex-col gap-1">
            <Text className="font-bold text-2xl">{`${user?.firstName} ${user?.lastName}`}</Text>
            <Button className="">
              <Text className="text-md">Editar Perfil</Text>
            </Button>
          </View>
        </View>
      </View>
      <View className="flex flex-col mt-10 items-start m-4  bg-muted rounded-xl p-4 gap-4">
        <TouchableOpacity
          onPress={() => {
            signOut();
            router.replace("/(auth)/sign-in");
          }}
          className="flex flex-row justify-between w-full  px-4 py-2"
        >
          <View className="flex flex-row gap-3 items-center">
            <Bell color="black" />
            <Text className="text-lg">Notificaciones</Text>
          </View>
          <ChevronRight color="gray" />
        </TouchableOpacity>
        <Separator />

        <TouchableOpacity
          onPress={() => {
            signOut();
            router.replace("/(auth)/sign-in");
          }}
          className="flex flex-row justify-between w-full  px-4 py-2"
        >
          <View className="flex flex-row gap-3 items-center">
            <Unlock color="black" />
            <Text className="text-lg">Adquirir Premium</Text>
          </View>
          <ChevronRight color="gray" />
        </TouchableOpacity>
        <Separator />

        <TouchableOpacity
          onPress={() => {
            signOut();
            router.replace("/(auth)/sign-in");
          }}
          className="flex flex-row justify-between w-full  px-4 py-2"
        >
          <View className="flex flex-row gap-3 items-center">
            <User color="black" />
            <Text className="text-lg">Mis Datos</Text>
          </View>
          <ChevronRight color="gray" />
        </TouchableOpacity>
        <Separator />

        <TouchableOpacity
          onPress={() => {
            signOut();
            router.replace("/(auth)/sign-in");
          }}
          className="flex flex-row justify-between w-full  px-4 py-2"
        >
          <View className="flex flex-row gap-3 items-center">
            <LogOut color="red" />
            <Text className="text-red-500 text-lg">Cerrar Sesión</Text>
          </View>
          <ChevronRight color="gray" />
        </TouchableOpacity>
      </View>

      <Text className="text-muted-foreground opacity-40  mt-20 mx-auto text-sm">
        Logueado con {user?.emailAddresses[0].emailAddress}
      </Text>
      <Text className="text-muted-foreground opacity-40   mx-auto text-sm">
        Versión 3.15.1
      </Text>
    </SafeAreaView>
  );
}
