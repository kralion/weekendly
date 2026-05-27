import React from "react";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

interface ConfirmedProps {
  planTitle: string;
  planImage: string;
  userImage: string;
  hoursToRespond?: number;
  onClose?: () => void;
  creatorPhone: string | null | undefined;
}

export function Confirmed({
  planImage,
  userImage,
  hoursToRespond = 36,
  onClose,
  creatorPhone,
}: ConfirmedProps) {
  const whatsappUrl = creatorPhone
    ? `https://wa.me/+51${creatorPhone}?text=Hola que tal`
    : "#";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-3xl w-full max-w-sm overflow-hidden p-6 flex flex-col items-center animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center mb-6">
          <div className="relative -right-4">
            <img
              src={planImage}
              alt=""
              className="w-[100px] h-[100px] rounded-full object-cover"
            />
          </div>
          <div className="relative -left-4">
            <img
              src={userImage}
              alt=""
              className="w-[100px] h-[100px] rounded-full object-cover"
            />
          </div>
        </div>

        <div className="items-center mb-10 text-center">
          <img
            src="https://img.icons8.com/?size=300&id=IBUUC7KokVgW&format=png&color=000000"
            alt=""
            className="w-[100px] h-[100px] mx-auto mb-2"
          />
          <Text className="text-2xl font-bold mb-2">¡Te has unido!</Text>

          <Text className="text-muted-foreground text-center">
            Tienes {hoursToRespond} horas para coordinar los detalles del plan
          </Text>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] h-11 px-8 w-full text-white font-semibold hover:opacity-90"
        >
          <img
            src="https://img.icons8.com/?size=100&id=85088&format=png&color=FFFFFF"
            alt=""
            className="w-5 h-5"
          />
          <Text className="text-white">Hablar por Whatsapp</Text>
        </a>
      </div>
    </div>
  );
}
