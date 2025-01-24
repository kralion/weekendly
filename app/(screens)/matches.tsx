import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { Link2, Send } from "lucide-react-native";
import * as React from "react";
import { ScrollView, View } from "react-native";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

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
  const renderMatchCard = ({ item }: { item: Props["item"] }) => (
    <View className="bg-white rounded-md  m-4 p-4 flex-col  gap-6">
      <Image
        source={{ uri: item.image }}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 8,
        }}
      />
      <View className="flex-1 gap-4">
        <View className="flex flex-row items-center gap-2">
          <Link2 size={16} color="purple" />
          <Text className="text-muted-foreground font-bold text-lg">
            {item.name}
          </Text>
        </View>
        <View className="flex flex-col bg-white rounded-lg p-4 gap-2">
          <Text className="text-primary font-bold text-lg">
            Detalles del Plan
          </Text>
          <Text className="text-muted-foreground">{item.description}</Text>
        </View>
      </View>
      <View className="flex-row gap-2">
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

      <Button className="bg-primary py-2 px-4 rounded-md flex flex-row gap-2 items-center">
        <Text className=" text-center text-lg">Conversar</Text>
        <Send size={16} color="white" />
      </Button>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        name="matches"
        options={{
          title: "Mis Planes",
          headerShown: true,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="bg-background"
      >
        <FlashList
          estimatedItemSize={100}
          data={mockMatches}
          keyExtractor={(item) => item.id}
          renderItem={renderMatchCard}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
}
