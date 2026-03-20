import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const generateAPIUrl = (relativePath: string) => {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.VITE_APP_URL || "http://localhost:3000";
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return origin.concat(path);
};
