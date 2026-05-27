import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useSearch } from "~/stores";
import { setHours, setMinutes, subDays } from "date-fns";
import { es } from "date-fns/locale";

const CATEGORIES = [
  "Música", "Arte", "Deportes", "Fotografía", "Gastronomía",
  "Viajes", "Cine", "Teatro", "Danza", "Literatura",
];

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

function SearchPage() {
  const [location, setLocation] = React.useState("");
  const { search } = useSearch();
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const navigate = useNavigate();

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSearch = () => {
    search({ location, date: date?.toISOString(), categories: selectedCategories });
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background pt-12">
      <div className="px-6 py-4 flex items-center md:mx-auto md:w-1/2">
        <Button variant="secondary" size="icon" className="rounded-full" onClick={() => navigate({ to: "/" })}>
          <ChevronLeft size={24} className="text-primary" />
        </Button>
        <Text className="text-xl font-semibold ml-4 md:text-2xl">Busca planes</Text>
      </div>

      <div className="flex flex-col gap-8 p-6 mt-4 md:max-w-2xl md:mx-auto">
        <DatePicker
          selected={date}
          onChange={(d: Date | null) => d && setDate(d)}
          minDate={subDays(new Date(), 0)}
          locale={es}
          className="flex-1 h-12 px-4 rounded-lg bg-muted/50 text-base w-full"
          placeholderText="Selecciona fecha"
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
        />
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ubicación del plan"
          className="md:text-base md:h-12"
        />
        <div>
          <Text className="text-base mb-2 md:text-lg">Categorías</Text>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`rounded-md px-6 py-2 md:px-8 md:py-3 ${
                  selectedCategories.includes(category) ? "bg-primary text-white" : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Button onClick={handleSearch} size="lg" className="m-4 md:mx-auto md:p-5">
        <Text className="text-white font-semibold text-lg">Buscar</Text>
      </Button>
    </div>
  );
}
