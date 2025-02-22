import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Camera,
  ChevronLeft,
  Image as ImageIcon,
  MapPin,
  Users,
} from "lucide-react-native";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dimensions,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "sonner-native";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { usePlans } from "~/stores";

const planSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  location: z.string().min(3, "La ubicación debe tener al menos 3 caracteres"),
  date: z.date().min(new Date(), "La fecha debe ser futura"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  max_participants: z.number().min(2, "Debe haber al menos 2 participantes"),
  imageUrl: z.string().url("Debe ser una URL válida"),
  interests: z.array(z.string()).min(1, "Selecciona al menos un interés"),
  category_id: z.string().min(1, "Debes seleccionar una categoría"),
});

type PlanFormData = z.infer<typeof planSchema>;

const INTERESTS = [
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

export default function CreatePlan() {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>(
    []
  );
  const { createPlan } = usePlans();
  const { user } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      date: new Date(),
      price: 0,
      max_participants: 2,
      imageUrl: "https://images.unsplash.com/photo-1513689125086-6c432170e843",
      interests: [],
      category_id: "",
    },
  });

  const onSubmit = async (data: PlanFormData) => {
    if (!user) {
      toast.error("Debes iniciar sesión para crear un plan");
      return;
    }

    try {
      await createPlan({
        title: data.title,
        description: data.description,
        location: data.location,
        date: data.date.toISOString(),
        max_participants: data.max_participants,
        creator_id: user.id,
        category_id: data.category_id,
      });
      toast.success("¡Plan creado con éxito!");
      router.back();
    } catch (error) {
      toast.error("Error al crear el plan");
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      const newInterests = prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest];
      setValue("interests", newInterests);
      return newInterests;
    });
  };

  return (
    <ScrollView
      className="flex-1 "
      contentContainerClassName="pb-10"
      showsVerticalScrollIndicator={false}
    >
      <View className="p-4 flex-row justify-between mt-10 gap-4 items-center absolute top-0 left-0 right-0 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
        >
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-white">Crear Plan</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
        >
          <Camera size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View className=" w-full h-[400px] rounded-b-3xl overflow-hidden mb-6">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1739741432363-8f5fa6ef4e7d?q=80&w=1434&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>

      {/* Form Fields */}
      <View className="flex flex-col gap-6 m-4">
        <View>
          <Text className="text-base mb-2">Título del Plan</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Ej: Concierto en el Parque"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.title?.message && (
            <Text className="text-red-500">{errors.title?.message}</Text>
          )}
        </View>

        <View>
          <Text className="text-base mb-2">Descripción</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Textarea
                placeholder="Describe tu plan..."
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.description?.message && (
            <Text className="text-red-500">{errors.description?.message}</Text>
          )}
        </View>

        <View>
          <Text className="text-base mb-2">Ubicación</Text>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Ej: Parque Central"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.location?.message && (
            <Text className="text-red-500">{errors.location?.message}</Text>
          )}
        </View>

        <View>
          <Text className="text-base mb-2">Fecha y Hora</Text>
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  className="flex-row items-center gap-2 border bg-secondary border-border rounded-lg p-3"
                >
                  <Calendar size={20} color="purple" />
                  <Text>
                    {value.toLocaleDateString("es", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={value}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                  />
                )}
              </>
            )}
          />
          {errors.date && (
            <Text className="text-destructive text-sm mt-1">
              {errors.date.message}
            </Text>
          )}
        </View>

        <View>
          <Text className="text-base mb-2">Número máximo de participantes</Text>
          <Controller
            control={control}
            name="max_participants"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="2"
                onChangeText={(text) => onChange(Number(text))}
                value={value.toString()}
                keyboardType="numeric"
              />
            )}
          />
          {errors.max_participants?.message && (
            <Text className="text-red-500">
              {errors.max_participants?.message}
            </Text>
          )}
        </View>
        <View>
          <Text className="text-base mb-2">Categoría</Text>
          <Controller
            control={control}
            name="category_id"
            render={({ field: { onChange, value } }) => (
              <View className="relative">
                <Input
                  placeholder="Ej: Música"
                  onChangeText={onChange}
                  value={value}
                  className="pl-10"
                />
                {errors.category_id?.message && (
                  <Text className="text-red-500">
                    {errors.category_id?.message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>
        <View>
          <Text className="text-base mb-2">Intereses</Text>
          <View className="flex-row flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <Pressable
                key={interest}
                onPress={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full border ${
                  selectedInterests.includes(interest)
                    ? "bg-primary border-primary"
                    : "border-border"
                }`}
              >
                <Text
                  className={
                    selectedInterests.includes(interest)
                      ? "text-white"
                      : "text-foreground"
                  }
                >
                  {interest}
                </Text>
              </Pressable>
            ))}
          </View>
          {errors.interests && (
            <Text className="text-destructive text-sm mt-1">
              {errors.interests.message}
            </Text>
          )}
        </View>
      </View>

      {/* Submit Button */}
      <Button
        onPress={handleSubmit(onSubmit)}
        className="mx-4 mt-10 rounded-full"
        size="lg"
      >
        <Text className="text-white font-semibold text-lg">Crear Plan</Text>
      </Button>
    </ScrollView>
  );
}
