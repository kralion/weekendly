import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Platform, Pressable, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  FadeInDown
} from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { es } from 'date-fns/locale/es'
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useSearch } from "~/stores";
import { setHours, setMinutes, subDays } from "date-fns";

const CATEGORIES = [
  "Música",
  "Arte",
  "Deportes",
  "Fotografía",
  "Gastronomía",
  "Viajes",
  "Cine",
  "Teatro",
  "Danza",
  "Literatura",
];



export default function SearchScreen() {
  const [location, setLocation] = React.useState("");
  const { search } = useSearch();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );



  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSearch = () => {
    search({
      location,
      date: date?.toISOString(),
      categories: selectedCategories
    });
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-background pt-12 ">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(500).springify()}
        className="px-6 py-4 flex-row items-center bg-background web:md:mx-auto web:md:w-1/2"
      >
        <Button
          className="rounded-full"
          onPress={() => router.back()}
          variant="secondary"
          size="icon"
        >
          <ChevronLeft size={24} color="#FF5733" />
        </Button>
        <Text className="text-xl font-semibold ml-4 web:md:text-2xl">
          Busca planes
        </Text>
      </Animated.View>


      <View className="flex flex-col gap-8 p-6 mt-4 web:md:max-w-2xl web:md:mx-auto">

        {Platform.OS === "web" && (
          <DatePicker
            selected={date}
            onChange={(newDate: Date | null) => {
              if (newDate) {
                setDate(newDate);
              }
              console.log(newDate);
            }}
            minDate={subDays(new Date(), 0)}
            locale={es}
            className="flex-1 h-12 px-4 rounded-lg bg-muted/50 text-base web:md:text-base"
            placeholderText="Selecciona fecha"
            showTimeSelect
            excludeTimes={[
              setHours(setMinutes(new Date(), 0), 17),
              setHours(setMinutes(new Date(), 30), 18),
              setHours(setMinutes(new Date(), 30), 19),
              setHours(setMinutes(new Date(), 30), 17),
            ]}
            dateFormat="MMMM d, yyyy h:mm aa"
          />

        )}

        {Platform.OS !== "web" && (

          <DateTimePicker
            style={{ marginLeft: -16 }}
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
            locale="es-ES"
          />


        )}
        <Input
          value={location}
          onChangeText={setLocation}
          placeholder="Ubicación del plan"
          className="web:md:text-base web:md:h-12"
        />

        <View>
          <Text className="text-base mb-2 web:md:text-lg">Categorías</Text>
          <View className="flex flex-row gap-2 flex-wrap">
            {CATEGORIES.map((category) => (
              <Pressable
                key={category}
                onPress={() => toggleCategory(category)}
                className={`rounded-md px-6 py-2 web:md:px-8 web:md:py-3 ${selectedCategories.includes(category)
                  ? "bg-primary"
                  : "bg-muted/50"
                  }`}
              >
                <Text
                  className={`${selectedCategories.includes(category)
                    ? "text-white"
                    : "text-muted-foreground"
                    } web:md:text-base`}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>

        </View>



      </View>
      <Button
        onPress={handleSearch}
        size="lg"
        className="m-4 web:md:mx-auto web:md:p-5"
      >
        <Text className="text-white font-semibold text-lg">
          Buscar
        </Text>
      </Button>


    </ScrollView>
  );
}
