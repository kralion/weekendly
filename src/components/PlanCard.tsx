import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Plan } from "~/types";
import { Text } from "./ui/text";

export function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  return (
    <div className="px-4 my-4 md:mx-auto md:w-[650px] animate-fade-in">
      <Link
        to="/plans/plan/$id"
        params={{ id: plan.id! }}
        className="block bg-white rounded-3xl overflow-hidden relative md:max-h-[500px]"
        style={{ minHeight: 300 }}
      >
        <img
          src={plan.image_url}
          alt={plan.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
          style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <Text className="text-2xl font-bold mb-2 text-white md:text-3xl">
            {plan.title}
          </Text>

          <div className="flex items-center mb-2 gap-1">
            <MapPin size={16} color="white" className="mr-1" />
            <Text className="text-white text-sm md:text-base">
              {plan.location}
            </Text>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {plan.categories.map((category, i) => (
              <div
                key={i}
                className="bg-white/20 px-3 py-1 rounded-full"
              >
                <Text className="text-white text-sm">{category}</Text>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between md:mt-2">
            <Text className="text-white text-sm md:text-base">
              {plan.participants.length}/{plan.max_participants} participantes
            </Text>
            <Text className="text-white text-sm md:text-base">
              {new Date(plan.date).toLocaleDateString("es", {
                weekday: "long",
                day: "numeric",
              })}
            </Text>
          </div>
        </div>
      </Link>
    </div>
  );
}
