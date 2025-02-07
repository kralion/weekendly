import { FlashList } from "@shopify/flash-list";
import { Image, ImageBackground } from "expo-image";
import { router, Stack } from "expo-router";
import { ChevronLeft, Link2, Send, X } from "lucide-react-native";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import { ScrollView, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
const { width, height } = Dimensions.get("window");
const mockMatches = [
  {
    id: "1",
    name: "John Doe",
    plan: "Acampar en Machu Pichu",
    description:
      "Salir a acampar a Machu Pichu, llevar solo cosas necesarias porque alla venden cosas",
    image: "https://mighty.tools/mockmind-api/content/human/80.jpg",
    hobbies: ["Hiking", "Cooking", "Painting", "Dancing"],
  },
  {
    id: "2",
    name: "Jane Smith",
    plan: "Cafe con regalos",
    description:
      "Salida con Jane al cafe de siempre, comprar algun regalo por su cumple pasado",
    image: "https://mighty.tools/mockmind-api/content/human/128.jpg",
    hobbies: ["Reading", "Gardening", "Cycling", "Traveling"],
  },
];
type Props = {
  item: {
    id: string;
    name: string;
    plan: string;
    description: string;
    image: string;
    hobbies: string[];
  };
};
export default function Home() {
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const renderMatchCard = ({ item }: { item: Props["item"] }) => (
    <ImageBackground
      source={{ uri: item.image }}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",

        justifyContent: "space-between",
      }}
    >
      <View className="p-4 mt-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
        >
          <X size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View className="flex flex-col gap-8 bg-black/70 p-6 h-[350px] rounded-t-2xl backdrop-blur-lg">
        <View className="flex flex-col gap-4">
          <View className="flex flex-row items-center gap-2">
            <Link2 size={16} color="white" />
            <Text className="text-white font-bold text-lg">{item.name}</Text>
          </View>
          <View className="flex flex-col gap-2">
            <Text className="text-white font-bold text-lg">
              Detalles del Plan
            </Text>
            <Text className="text-white">{item.description}</Text>
          </View>
        </View>
        <View className="flex-row flex gap-2">
          {item.hobbies.map((hobby: string, index: number) => (
            <Badge
              variant={index % 2 === 0 ? "default" : "secondary"}
              key={index}
              className="text-muted-foreground text-sm flex"
            >
              <Text>• {hobby}</Text>
            </Badge>
          ))}
        </View>

        <Button className="bg-green-500 py-2 px-4 rounded-md flex flex-row gap-2 items-center">
          <Image
            source={{
              uri: "https://img.icons8.com/?size=100&id=16712&format=png&color=FFFFFF",
            }}
            style={{ width: 20, height: 20 }}
          />
          <Text className=" text-center text-lg text-white">Whatsapp</Text>
        </Button>
      </View>
    </ImageBackground>
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        name="matches"
        options={{
          title: "Mis Planes",
          headerShown: true,
          headerLargeTitle: true,
          presentation: "modal",
          headerLargeTitleShadowVisible: false,
        }}
      />
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        decelerationRate="fast"
        snapToInterval={height}
        showsVerticalScrollIndicator={false}
      >
        {mockMatches.map((match, index) => (
          <View key={match.id} style={{ width, height }}>
            <View>{renderMatchCard({ item: match })}</View>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}
