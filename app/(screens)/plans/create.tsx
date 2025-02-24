import { useUser } from "@clerk/clerk-expo";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { Camera, X } from "lucide-react-native";
import * as React from "react";
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
import { usePlans } from "~/stores";
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
        <View className="flex-1 bg-background">
          <Image
            source={{ uri: imageUrl }}
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
        <View className="w-full h-[400px] rounded-b-3xl overflow-hidden mb-6">
          <Image
            source={{
              uri: imageUrl,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        <View className="flex flex-col gap-8 p-6">
          <View>
            <Text className="text-base mb-2">Título del Plan</Text>
            <Input
              value={title}
              onChangeText={setTitle}
              autoCapitalize="sentences"
              placeholder="Ej: Salida al café"
            />
            {errors.title && (
              <Text className="text-red-500 text-sm">{errors.title}</Text>
            )}
          </View>

          <View>
            <Text className="text-muted-foreground mb-2">Descripción</Text>
            <Textarea
              value={description}
              onChangeText={setDescription}
              placeholder="Describe tu plan..."
            />
            {errors.description && (
              <Text className="text-red-500 text-sm">{errors.description}</Text>
            )}
          </View>

          <View>
            <Text className="text-base mb-2">Ubicación</Text>
            <Input
              value={location}
              onChangeText={setLocation}
              placeholder="¿Dónde será el plan?"
            />
            {errors.location && (
              <Text className="text-red-500 text-sm">{errors.location}</Text>
            )}
          </View>

          <View>
            <Text className="text-base mb-2">Fecha y Hora</Text>
            <DateTimePicker
              value={date}
              style={{ marginLeft: -18 }}
              mode="datetime"
              display="default"
              minuteInterval={15}
              locale="es-ES"
              onChange={(_, selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          </View>

          <View>
            <Text className="text-base mb-2">Categorías</Text>
            <View className="flex flex-row gap-2 flex-wrap">
              {CATEGORIES.map((category) => (
                <Pressable
                  key={category}
                  onPress={() => toggleCategory(category)}
                  className={`rounded-md px-6 py-2 ${
                    selectedCategories.includes(category)
                      ? "bg-primary"
                      : "bg-zinc-100"
                  }`}
                >
                  <Text
                    className={
                      selectedCategories.includes(category)
                        ? "text-white"
                        : "text-black"
                    }
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors.categories && (
              <Text className="text-red-500 text-sm">{errors.categories}</Text>
            )}
          </View>

          <View className="flex flex-row gap-2 justify-center mt-5">
            <Button
              onPress={handleSubmit}
              className={`rounded-full ${id ? "" : "w-full"}`}
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
