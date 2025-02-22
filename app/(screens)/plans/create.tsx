import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Camera, X } from "lucide-react-native";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { planSchema } from "~/schemas";
import { usePlans } from "~/stores";
import { Plan } from "~/types";

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

export default function CreatePlan() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [image_url, setImage_url] = React.useState<string>(
    "https://images.unsplash.com/photo-1739741432363-8f5fa6ef4e7d?q=80&w=1434&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const { createPlan, loading } = usePlans();
  const { user } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Plan>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      participants: [user?.id],
      max_participants: 2,
      image_url: "https://images.unsplash.com/photo-1513689125086-6c432170e843",
      categories: [],
      status: "activo",
    },
  });
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.canceled) {
      try {
        setIsLoading(true);
        const base64Img = result.assets[0].base64;
        const formData = new FormData();
        formData.append("file", `data:image/jpeg;base64,${base64Img}`);
        formData.append("upload_preset", "ml_default");
        formData.append("folder", "weekendly/plans");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/diqe1byxy/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setImage_url(data.secure_url);
        setIsLoading(false);
        return data.secure_url;
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
  };

  const onSubmit = async (data: Plan) => {
    if (!user) {
      toast.error("Debes iniciar sesión para crear un plan");
      return;
    }
    await createPlan({
      title: data.title,
      description: data.description,
      location: data.location,
      image_url,
      date: data.date,
      max_participants: data.max_participants,
      creator_id: user.id,
      categories: data.categories,
    });
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 "
        contentContainerClassName="pb-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4 flex-row justify-between mt-10 gap-4 items-center absolute top-0 left-0 right-0 z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
          >
            <X size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-white">Crear Plan</Text>
          <TouchableOpacity
            onPress={pickImage}
            className="w-10 h-10 justify-center items-center bg-black/20 rounded-full"
          >
            {isLoading ? (
              <ActivityIndicator animating color="white" />
            ) : (
              <Camera size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <View className=" w-full h-[400px] rounded-b-3xl overflow-hidden mb-6">
          <Image
            source={{
              uri: image_url,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {/* Form Fields */}
        <View className="flex flex-col gap-8 p-6">
          <View>
            <Text className="text-base mb-2">Título del Plan</Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <Input
                  onChangeText={onChange}
                  placeholder="Ej: Salida al café"
                  value={value}
                />
              )}
            />
            {errors.title?.message && (
              <Text className="text-red-500">{errors.title?.message}</Text>
            )}
          </View>

          <View>
            <Text className="text-muted-foreground mb-2">Descripción</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <Textarea onChangeText={onChange} value={value} />
              )}
            />
            {errors.description?.message && (
              <Text className="text-red-500">
                {errors.description?.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-base mb-2">Ubicación</Text>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <Input onChangeText={onChange} value={value} />
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
                <DateTimePicker
                  value={new Date(value)}
                  style={{ marginLeft: -18 }}
                  mode="datetime"
                  display="default"
                  minuteInterval={15}
                  locale="es-ES"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      onChange(selectedDate);
                    }
                  }}
                />
              )}
            />
            {errors.date && (
              <Text className="text-destructive text-sm mt-1">
                {errors.date.message}
              </Text>
            )}
          </View>
          <View>
            <Text className="text-base mb-2">Categorías</Text>
            <Controller
              control={control}
              name="categories"
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-row gap-2 flex-wrap">
                  {CATEGORIES.map((item) => (
                    <Pressable
                      key={item}
                      onPress={() => {
                        const newValue = value.includes(item)
                          ? value.filter((v) => v !== item)
                          : [...value, item];
                        onChange(newValue);
                      }}
                      className={`rounded-md px-6 py-2 ${
                        value.includes(item) ? "bg-primary" : "bg-zinc-100"
                      }`}
                    >
                      <Text
                        className={`
                        ${value.includes(item) ? "text-white" : "text-black"}
                        `}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            />
            {errors.categories?.message && (
              <Text className="text-xs text-red-500">
                {errors.categories?.message}
              </Text>
            )}
          </View>
          <Button
            onPress={handleSubmit(onSubmit)}
            className="mt-10 rounded-full"
            size="lg"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Crear Plan
              </Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
