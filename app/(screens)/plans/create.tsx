import { useUser } from "@clerk/clerk-expo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { Camera, X } from "lucide-react-native";
import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
import { usePlans } from "~/stores";

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
  const [imageUrl, setImageUrl] = React.useState<string>(
    "https://plus.unsplash.com/premium_photo-1663115409520-989b46bd6eca?q=80&w=1534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );

  // Form states
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    []
  );
  const [maxParticipants, setMaxParticipants] = React.useState(2);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);

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

  React.useEffect(() => {
    if (id) {
      fetchPlanById(id as string);
      if (selectedPlan) {
        setTitle(selectedPlan.title);
        setDescription(selectedPlan.description);
        setLocation(selectedPlan.location);
        setDate(new Date(selectedPlan.date));
        setSelectedCategories(selectedPlan.categories);
        setMaxParticipants(selectedPlan.max_participants);
        setImageUrl(selectedPlan.image_url);
      }
    }
  }, [id, setSelectedPlan]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title) newErrors.title = "El título es requerido";
    if (!description) newErrors.description = "La descripción es requerida";
    if (!location) newErrors.location = "La ubicación es requerida";
    if (selectedCategories.length === 0)
      newErrors.categories = "Selecciona al menos una categoría";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        setImageUrl(data.secure_url);
        setIsLoading(false);
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Error al subir la imagen");
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const planData = {
        title,
        description,
        location,
        image_url: imageUrl,
        date,
        max_participants: maxParticipants,
        creator_id: user.id,
        categories: selectedCategories,
        status: "activo" as const,
        participants: [],
      };

      if (id) {
        await updatePlan(id as string, planData);
        setSelectedPlan(null);
        toast.success("Plan actualizado exitosamente");
      } else {
        await createPlan(planData);
        // Success toast is shown by the store
      }

      router.back();
    } catch (error) {
      // Error toast is already shown by the store
      console.error("Error in form submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Main Image */}
        <View className="w-full h-[400px] overflow-hidden web:md:max-w-2xl web:md:mx-auto web:md:h-[500px] web:md:rounded-b-3xl">
          <Image
            source={{
              uri: imageUrl,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {/* Header Section with Blur */}
        <View className="absolute top-0 left-0 right-0 z-10">
          <BlurView
            intensity={10}
            tint="dark"
            style={{
              width: "100%",
              height: HEADER_HEIGHT,
            }}
          />

          {/* Header Navigation */}
          <View className="p-4 flex-row justify-between mt-8 gap-4 items-center z-20 h-16 absolute top-0 left-0 right-0">
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

        {/* Content Section */}
        <View className="flex flex-col gap-8 p-6 mt-4 web:md:max-w-2xl web:md:mx-auto">
          <View>
            <Text className="text-base mb-2 web:md:text-lg">
              Título del Plan
            </Text>
            <Input
              value={title}
              onChangeText={setTitle}
              autoCapitalize="sentences"
              placeholder="Ej: Salida al café"
              className="web:md:text-base web:md:h-12"
            />
            {errors.title && (
              <Text className="text-red-500 text-sm web:md:text-base">
                {errors.title}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-muted-foreground mb-2 web:md:text-lg">
              Descripción
            </Text>
            <Textarea
              value={description}
              onChangeText={setDescription}
              placeholder="Describe tu plan..."
              className="web:md:text-base"
            />
            {errors.description && (
              <Text className="text-red-500 text-sm web:md:text-base">
                {errors.description}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-base mb-2 web:md:text-lg">Ubicación</Text>
            <Input
              value={location}
              onChangeText={setLocation}
              placeholder="¿Dónde será el plan?"
              className="web:md:text-base web:md:h-12"
            />
            {errors.location && (
              <Text className="text-red-500 text-sm web:md:text-base">
                {errors.location}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-base mb-2 web:md:text-lg">Fecha y Hora</Text>
            {Platform.OS === "web" ? (
              <View className="flex flex-row gap-4">
                <DatePicker
                  selected={date}
                  onChange={(newDate: Date | null) => {
                    if (newDate) {
                      setDate(newDate);
                    }
                  }}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  locale="es"
                  className="flex-1 h-12 px-4 rounded-lg bg-muted/50 text-base web:md:text-base"
                  placeholderText="Selecciona fecha y hora"
                />
              </View>
            ) : (
              <View className="flex flex-row gap-4">
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="flex-1 h-12 px-4 rounded-lg bg-muted/50 justify-center"
                >
                  <Text className="text-base">
                    {date.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  className="flex-1 h-12 px-4 rounded-lg bg-muted/50 justify-center"
                >
                  <Text className="text-base">
                    {date.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {showDatePicker && Platform.OS !== "web" && (
              <DateTimePicker
                value={date}
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

            {showTimePicker && Platform.OS !== "web" && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowTimePicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
                locale="es-ES"
              />
            )}

            {errors.date && (
              <Text className="text-red-500 text-sm web:md:text-base">
                {errors.date}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-base mb-2 web:md:text-lg">Categorías</Text>
            <View className="flex flex-row gap-2 flex-wrap">
              {CATEGORIES.map((category) => (
                <Pressable
                  key={category}
                  onPress={() => toggleCategory(category)}
                  className={`rounded-md px-6 py-2 web:md:px-8 web:md:py-3 ${
                    selectedCategories.includes(category)
                      ? "bg-primary"
                      : "bg-zinc-100"
                  }`}
                >
                  <Text
                    className={`${
                      selectedCategories.includes(category)
                        ? "text-white"
                        : "text-black"
                    } web:md:text-base`}
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors.categories && (
              <Text className="text-red-500 text-sm web:md:text-base">
                {errors.categories}
              </Text>
            )}
          </View>

          <View className="flex flex-row gap-2 justify-center mt-5">
            <Button
              onPress={handleSubmit}
              className={`rounded-full ${id ? "" : "w-full"} web:md:max-w-xs`}
              size="lg"
            >
              {isLoading || loading ? (
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
                className="rounded-full web:md:max-w-xs"
                variant="destructive"
                size="lg"
              >
                <Text className="web:md:text-base">Eliminar Plan</Text>
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
