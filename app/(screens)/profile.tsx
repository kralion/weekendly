import { useAuth } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import { router, Stack } from "expo-router";
import {
  CheckCircle,
  ChevronLeft,
  Heart,
  Link2,
  Star,
} from "lucide-react-native";
import React from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
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
export default function ProfileScreen() {
  const { signOut } = useAuth();
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        name="profile"
        options={{
          title: "Mi Perfil",
          headerBackTitle: "Atrás",
        }}
      />
      <ScrollView className="bg-background">
        {/* Header */}
        <View className="p-4 flex-row mt-10 justify-between items-center absolute top-0 left-0 right-0 z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className=" h-10 w-28 px-2 justify-center items-center bg-black/20  rounded-full"
            onPress={() => {
              router.push("/(screens)/matches");
            }}
          >
            <Text className=" font-bold text-sm text-white">Mis Planes</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Banner */}
        <View style={{ position: "relative", width: "100%", height: 200 }}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1513689125086-6c432170e843?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </View>

        {/* Profile Info */}
        <View className="px-4 -mt-16">
          <View className="relative">
            <View className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                }}
                className="w-full h-full"
              />
            </View>
            <View className="absolute top-0 left-0 w-24 h-24 rounded-full border-2 border-blue-500" />
            <View className="absolute bottom-0 left-16 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
          </View>

          <View className="mt-4 flex-row justify-between items-center">
            <View>
              <View className="flex-row items-center">
                <Text className="text-xl font-bold">Kim Parkinson</Text>
                <CheckCircle size={16} color="#1DA1F2" className="ml-1" />
              </View>
              <Text className="text-gray-600">theunderdog</Text>
            </View>
            <TouchableOpacity>
              <Heart size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          <Text className="mt-4 text-gray-800">
            I will inspire 10 million people to do what they love the best they
            can!
          </Text>

          {/* Ratings */}
          <View className="flex-row items-center mt-4">
            <Star size={16} color="#FFD700" />
            <Star size={16} color="#FFD700" />
            <Star size={16} color="#FFD700" />
            <Star size={16} color="#FFD700" />
            <Star size={16} color="#FFD700" />
            <Text className="ml-2 text-gray-600">26 reviews</Text>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between mt-4">
            <View>
              <Text className="font-bold">$3.00</Text>
              <Text className="text-sm text-gray-600">rate per min</Text>
            </View>
            <View>
              <Text className="font-bold">5 mins</Text>
              <Text className="text-sm text-gray-600">min talk time</Text>
            </View>
            <View>
              <Text className="font-bold">36</Text>
              <Text className="text-sm text-gray-600">sessions</Text>
            </View>
          </View>
          <Button
            onPress={() => signOut()}
            className="my-8"
            variant="destructive"
          >
            <Text>Cerrar Sessión </Text>
          </Button>
          {/* Subscribe Button */}
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

          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-between p-4 bg-transparent">
        <Button
          className="flex-1 gap-3 ml-2   rounded-full flex-row justify-center items-center"
          onPress={() => {
            router.push("/(screens)/matches");
          }}
        >
          <Link2 size={24} color="white" className="mr-2" />
          <Text className="text-white font-semibold">Mis Planes</Text>
        </Button>
      </View>
    </View>
  );
}
