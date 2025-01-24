import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

const mockProfiles = [
  {
    id: "1",
    name: "John Doe",
    bio: "Love hiking and exploring new places.",
    distance: "5 miles away",
    image: "https://mighty.tools/mockmind-api/content/human/80.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    bio: "Coffee enthusiast and weekend adventurer.",
    distance: "10 miles away",
    image: "https://mighty.tools/mockmind-api/content/human/128.jpg",
  },
];
const categories = [
  {
    name: "Food",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    description: "Explore delicious cuisines and recipes.",
    popularity: "High",
  },
  {
    name: "Outdoor",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    description: "Discover outdoor activities and adventures.",
    popularity: "Medium",
  },
  {
    name: "Music",
    image: "https://images.unsplash.com/photo-1497032201393-7c2b5f1e7b5f",
    description: "Find your favorite music genres and artists.",
    popularity: "High",
  },
  {
    name: "Art",
    image: "https://images.unsplash.com/photo-1517841905240-4729888e1b3f",
    description: "Explore various forms of art and creativity.",
    popularity: "Medium",
  },
];

const hobbies = [
  {
    name: "Hiking",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    description: "Enjoy the beauty of nature while hiking.",
    popularity: "High",
  },
  {
    name: "Cooking",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    description: "Learn new recipes and cooking techniques.",
    popularity: "High",
  },
  {
    name: "Painting",
    image: "https://images.unsplash.com/photo-1497032201393-7c2b5f1e7b5f",
    description: "Express your creativity through painting.",
    popularity: "Medium",
  },
  {
    name: "Dancing",
    image: "https://images.unsplash.com/photo-1517841905240-4729888e1b3f",
    description: "Enjoy dancing and learn new styles.",
    popularity: "High",
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
export default function Home() {
  const [profiles, setProfiles] = useState(mockProfiles);

  const handleInvite = (profileId: string) => {
    router.push("/(screens)/match-profile");
  };
  const renderProfileCard = ({ item }: { item: any }) => (
    <View className="bg-card rounded-md shadow m-4 p-4">
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.image }}
          className="h-40 w-full rounded-md mb-4"
          style={{ borderRadius: 8, height: 100, width: 100 }}
        />
        <View className="flex-1 ml-4">
          <Text className="text-primary font-bold text-lg">{item.name}</Text>
          <Text className="text-muted-foreground mt-1">{item.bio}</Text>
          <Text className="text-secondary-foreground mt-1">
            {item.distance}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleInvite(item.id)}
        className="bg-primary mt-4 py-2 px-4 rounded-md"
      >
        <Text className="text-primary-foreground text-center font-semibold">
          Send Invite
        </Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Descubre Planes",
          headerShown: true,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 bg-white"
      >
        <View className="flex flex-row justify-between  p-4">
          <View className="flex flex-col gap-2 ">
            <Text className="text-4xl font-bold">Descubre</Text>
            <TextInput
              placeholder="Search for categories or hobbies..."
              className="h-12 border border-gray-300 rounded-md p-2 mb-4 "
            />
          </View>
          <TouchableOpacity onPress={() => router.push("/(screens)/profile")}>
            <Avatar
              alt="User"
              style={{
                width: 40,
                height: 40,
              }}
            >
              <AvatarImage
                source={{
                  uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                }}
              />
              <AvatarFallback>
                <Text>FN</Text>
              </AvatarFallback>
            </Avatar>
          </TouchableOpacity>
        </View>

        <FlashList
          data={profiles}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id}
          renderItem={renderProfileCard}
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
