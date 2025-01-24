import { FlashList } from "@shopify/flash-list";
import { Stack } from "expo-router";
import { PhoneCall, Star } from "lucide-react-native";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button } from "~/components/ui/button";
const hobbies = [
  {
    name: "Senderismo",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    description:
      "Disfruta de la belleza de la naturaleza mientras haces senderismo.",
    popularity: "Alto",
  },
  {
    name: "Cocina",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    description: "Aprende recetas nuevas y t cnicas de cocina.",
    popularity: "Alto",
  },
  {
    name: "Pintura",
    image: "https://images.unsplash.com/photo-1497032201393-7c2b5f1e7b5f",
    description: "Expresa tu creatividad a trav s de la pintura.",
    popularity: "Medio",
  },
  {
    name: "Danza",
    image: "https://images.unsplash.com/photo-1517841905240-4729888e1b3f",
    description:
      "Danza y música para expresarte y vivir momentos inolvidables.",
    popularity: "Alto",
  },
];
export default function ProfileScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        name="match-profile"
        options={{
          title: "Match Perfil",
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerBackTitle: "Atrás",
          headerShown: true,
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View className="p-4">
          <View className="relative">
            <View className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                }}
                className="w-full h-full"
                height={200}
                width={200}
              />
            </View>
            <View className="absolute top-0 left-0 w-24 h-24 rounded-full border-2 border-blue-500" />
            <View className="absolute bottom-0 left-16 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
          </View>

          <View className="mt-4 flex-row justify-between items-center">
            <View>
              <View className="flex-row items-center">
                <Text className="text-xl font-bold">Kim Parkinson</Text>
              </View>
              <Text className="text-gray-600">theunderdog</Text>
            </View>
          </View>

          <Text className="mt-4 text-gray-800">
            Amante de la naturaleza y el senderismo. Me encanta explorar
            montañas y descubrir nuevos paisajes.
          </Text>

          <View className="flex-row items-center mt-4">
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Star size={16} color="#FFD700" />
            <Text className="ml-2 text-gray-600">26 reviews</Text>
          </View>

          <FlashList
            estimatedItemSize={75}
            data={hobbies}
            renderItem={({ item }) => (
              <Button
                variant="secondary"
                className="mr-2 mb-2 rounded-full"
                onPress={() => console.log(`Selected ${item.name}`)}
              >
                <Text>{item.name}</Text>
              </Button>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />

          {/* Media Section */}
          <Text className="mt-6 mb-2 font-semibold">Media</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Image
              source={{
                uri: "https://plus.unsplash.com/premium_photo-1675827055694-010aef2cf08f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmF0dXJlfGVufDB8fDB8fHww",
              }}
              className="w-24 h-24 rounded-lg mr-2"
            />
            <Image
              source={{
                uri: "https://plus.unsplash.com/premium_photo-1664367173144-7e854e199524?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5fGVufDB8fDB8fHww",
              }}
              className="w-24 h-24 rounded-lg mr-2"
            />
            <Image
              source={{
                uri: "https://plus.unsplash.com/premium_photo-1673603988651-99f79e4ae7d3?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bmF0dXJlfGVufDB8fDB8fHww",
              }}
              className="w-24 h-24 rounded-lg"
            />
          </ScrollView>

          {/* Spacer for absolute buttons */}
          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-between p-4 bg-transparent">
        <TouchableOpacity className="flex-1 gap-3 ml-2 bg-green-500 p-4 rounded-full flex-row justify-center items-center">
          <PhoneCall size={24} color="white" className="mr-2" />
          <Text className="text-white font-semibold">Enviar Whatsapp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
