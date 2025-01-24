import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

const mockProfiles = [
  {
    id: "1",
    name: "Juan Doe",
    bio: "Me encanta hacer senderismo y explorar nuevos lugares.",
    distance: "5 millas de distancia",
    image: "https://mighty.tools/mockmind-api/content/human/80.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    bio: "Enthusiasta del caf  y aventurera de fin de semana.",
    distance: "10 millas de distancia",
    image: "https://mighty.tools/mockmind-api/content/human/128.jpg",
  },
];
const categories = [
  {
    name: "Comida",
    image:
      "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    description: "Explora deliciosas cocinas y recetas.",
    popularity: "Alta",
  },
  {
    name: "Aventura",
    image:
      "https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlfGVufDB8fDB8fHww",
    description: "Actividades al aire libre y deportes extremos.",
    popularity: "Media",
  },
  {
    name: "Deportes",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3BvcnR8ZW58MHx8MHx8fDA%3D",
    description: "Todo sobre deportes y actividades físicas.",
    popularity: "Alta",
  },
  {
    name: "Música",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bXVzaWN8ZW58MHx8MHx8fDA%3D",
    description: "Conciertos, festivales y música en vivo.",
    popularity: "Alta",
  },
  {
    name: "Arte",
    image:
      "https://plus.unsplash.com/premium_photo-1661767490975-f31a02946f48?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXJ0fGVufDB8fDB8fHww",
    description: "Exposiciones, galerías y eventos artísticos.",
    popularity: "Media",
  },
  {
    name: "Tecnología",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGVjaHxlbnwwfHwwfHx8MA%3D%3D",
    description: "Novedades y avances en el mundo tecnológico.",
    popularity: "Alta",
  },
  {
    name: "Viajes",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHJhdmVsfGVufDB8fDB8fHww",
    description: "Descubre nuevos destinos y experiencias.",
    popularity: "Alta",
  },
  {
    name: "Lectura",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJlYWR8ZW58MHx8MHx8fDA%3D",
    description: "Libros, literatura y clubes de lectura.",
    popularity: "Baja",
  },
];
const hobbies = [
  {
    name: "Senderismo",
    image:
      "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGlraW5nfGVufDB8fDB8fHww",
    description:
      "Disfruta de la belleza de la naturaleza mientras haces senderismo.",
    popularity: "Alta",
  },
  {
    name: "Cocina",
    image:
      "https://images.unsplash.com/photo-1527667455007-10a82aed3892?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29va3xlbnwwfHwwfHx8MA%3D%3D",
    description: "Aprende recetas nuevas y t cnicas de cocina.",
    popularity: "Alta",
  },
  {
    name: "Pintura",
    image:
      "https://plus.unsplash.com/premium_photo-1661700093968-b538c5a9f539?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGFpbnR8ZW58MHx8MHx8fDA%3D",
    description: "Expresa tu creatividad a trav s de la pintura.",
    popularity: "Media",
  },
  {
    name: "Baile",
    image:
      "https://plus.unsplash.com/premium_photo-1681492529719-a1d3d8cc498a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGFuY2luZ3xlbnwwfHwwfHx8MA%3D%3D",
    description: "Disfruta bailando y aprende nuevos estilos.",
    popularity: "Alta",
  },
];

function CardRender({ item }: { item: any }) {
  return (
    <Card
      style={{ width: 250, height: 400 }}
      className="ml-4 bg-white rounded-lg shadow "
    >
      <CardHeader>
        <Image
          source={{ uri: item.image }}
          style={{ height: 200, width: "100%", borderRadius: 8 }}
        />
        <CardTitle className="mt-8">{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text>{item.description}</Text>
        <Text className="text-sm text-gray-500">
          Popularity: {item.popularity}
        </Text>
      </CardContent>
    </Card>
  );
}
const renderProfileCard = ({ item, handleInvite }: any) => (
  <View className="bg-white rounded-md shadow m-4 p-4">
    <View className="flex-row items-center">
      <Image
        source={{ uri: item.image }}
        className="h-40 w-full rounded-md mb-4"
        style={{ borderRadius: 8, height: 100, width: 100 }}
      />
      <View className="flex-1 ml-4">
        <Text className=" font-bold text-lg">{item.name}</Text>
        <Text className="text-muted-foreground mt-1">{item.bio}</Text>
        <Badge variant="secondary">
          <Text className="text-secondary-foreground mt-1 text-xs">
            {item.distance}
          </Text>
        </Badge>
      </View>
    </View>
    <TouchableOpacity
      onPress={() => handleInvite(item.id)}
      className="bg-primary mt-4 py-2 px-4 rounded-md"
    >
      <Text className="text-primary-foreground text-center font-semibold">
        Conectar
      </Text>
    </TouchableOpacity>
  </View>
);
export default function Home() {
  const [profiles, setProfiles] = useState(mockProfiles);

  const handleInvite = (profileId: string) => {
    router.push("/(screens)/match-profile");
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 bg-background"
      >
        <FlashList
          data={profiles}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderProfileCard({ item, handleInvite })}
          showsVerticalScrollIndicator={false}
        />

        <Text className="text-lg font-bold mb-2 px-4">Categories</Text>
        <FlashList
          estimatedItemSize={75} // Set a reasonable estimated item size
          data={categories}
          renderItem={({ item }) => <CardRender item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }} // Add padding to the content
        />

        <Text className="text-lg font-bold mt-4 mb-2 px-4">
          Popular Hobbies
        </Text>
        <FlashList
          estimatedItemSize={75}
          data={hobbies}
          renderItem={({ item }) => <CardRender item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
}
