import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { Camera, Lock, Trash, X } from "lucide-react-native";
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
import { LinearGradient } from "expo-linear-gradient";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { planSchema } from "~/schemas";
import { usePlans } from "~/stores";
import { Plan } from "~/types";
import { BlurView } from "expo-blur";

const HEADER_HEIGHT = 100;

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
  const { id } = useLocalSearchParams();
  const [image_url, setImage_url] = React.useState<string>(
    "https://plus.unsplash.com/premium_photo-1663115409520-989b46bd6eca?q=80&w=1534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const {
    createPlan,
    loading,
    updatePlan,
    fetchPlanById,
    selectedPlan,
    deletePlan,
    setSelectedPlan,
  } = usePlans();
  const { user } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Plan>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      participants: [user?.id],
      max_participants: 2,
      image_url:
        "https://plus.unsplash.com/premium_photo-1663115409520-989b46bd6eca?q=80&w=1534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      categories: [],
      status: "activo",
    },
  });

  React.useEffect(() => {
    if (id) {
      fetchPlanById(id as string);
      setValue("image_url", image_url);
      setImage_url(image_url);
      setValue("categories", selectedPlan?.categories || []);
      setValue("title", selectedPlan?.title || "");
      setValue("description", selectedPlan?.description || "");
      setValue("location", selectedPlan?.location || "");
      setValue("date", selectedPlan?.date || new Date());
      setValue("max_participants", selectedPlan?.max_participants || 2);
      setValue("status", selectedPlan?.status || "activo");
    }
    console.log("render");
  }, [id, setSelectedPlan]);
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

  async function handleCreatePlan(data: Plan) {
    if (!user) return;
    setIsLoading(true);
    try {
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
    } catch (error) {
      toast.error("Error al crear plan");
    }
    setIsLoading(false);
    reset();
  }

  async function handleUpdatePlan(data: Plan) {
    if (!user) return;
    setIsLoading(true);
    try {
      await updatePlan(data.id as string, {
        title: data.title,
        description: data.description,
        location: data.location,
        image_url,
        date: data.date,
        max_participants: data.max_participants,
        creator_id: user.id,
        categories: data.categories,
      });
    } catch (error) {
      toast.error("Error al actualizar plan");
    }
    setIsLoading(false);
    reset();
  }

  const onSubmit = async (data: Plan) => {
    if (id) {
      await handleUpdatePlan(data);
    } else {
      await handleCreatePlan(data);
    }
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 "
        contentContainerClassName="pb-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-background">
          <Image
            source={{ uri: image_url }}
            style={{
              width: "100%",
              height: HEADER_HEIGHT,
              position: "absolute",
              top: 0,
            }}
            className="bg-muted"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: HEADER_HEIGHT,
              zIndex: 5,
            }}
          />
          <BlurView
            intensity={10}
            tint="dark"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: HEADER_HEIGHT * 1.1,
              zIndex: 6,
              transform: [{ translateY: -HEADER_HEIGHT * 0.15 }],
            }}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.05)", "rgba(0,0,0,0.1)"]}
            style={{
              position: "absolute",
              top: HEADER_HEIGHT * 0.6,
              left: 0,
              right: 0,
              height: HEADER_HEIGHT * 0.4,
              zIndex: 7,
            }}
          />
          <View className="p-4 flex-row justify-between mt-8 gap-4 items-center absolute top-0 left-0 right-0 z-10">
            <TouchableOpacity
              onPress={() => {
                setSelectedPlan(null);
                router.back();
              }}
              className="w-10 h-10 justify-center items-center bg-black/30 rounded-full active:opacity-70"
            >
              <X size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-white drop-shadow-xl">
              {id ? "Editar Plan" : "Crear Plan"}
            </Text>
            <TouchableOpacity
              onPress={pickImage}
              className="w-10 h-10 justify-center items-center bg-black/30 rounded-full active:opacity-70"
            >
              {isLoading ? (
                <ActivityIndicator animating color="white" />
              ) : (
                <Camera size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
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
                  autoCapitalize="sentences"
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
          <View className="flex flex-row gap-2 justify-center mt-5">
            <Button
              onPress={handleSubmit(onSubmit)}
              className={`rounded-full ${id ? "" : "w-full"}`}
              size="lg"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-lg">
                  {id ? "Guardar Cambios" : "Crear Plan"}
                </Text>
              )}
            </Button>
            {id && (
              <Button
                onPress={() => {
                  deletePlan(id as string);
                  router.back();
                }}
                className="rounded-full"
                variant="destructive"
                size="lg"
              >
                <Text>Eliminar Plan</Text>
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
