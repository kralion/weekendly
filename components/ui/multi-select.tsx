import { Check, ChevronDown, ChevronUp, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";
import { Text } from "./text";

export type Option<T extends string = string> =
  | {
      label: string;
      value: T;
    }
  | T;

interface MultiSelectProps<T extends string = string> {
  options: Option<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  placeholder?: string;
  className?: string;
  style?: ViewStyle;
}

export function MultiSelect<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  className = "",
  style,
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { label: option, value: option as T } : option
  );

  const selectedOptions = normalizedOptions.filter((option) =>
    value.includes(option.value)
  );

  const handleToggleOption = (optionValue: T) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemoveOption = (optionValue: T) => {
    onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <View className={`relative ${className}`} style={style}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="flex-row items-center justify-between p-3 bg-white border border-border rounded-md"
      >
        <View className="flex-1">
          {selectedOptions.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {selectedOptions.map((option) => (
                <View
                  key={option.value}
                  className="flex-row items-center bg-gray-100 rounded-md px-3 py-1.5 gap-2"
                >
                  <Text className="text-sm mr-1">{option.label}</Text>
                  <TouchableOpacity
                    hitSlop={10}
                    onPress={() => handleRemoveOption(option.value)}
                  >
                    <X size={14} color="#C39BD3" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-gray-500">{placeholder}</Text>
          )}
        </View>
        {isOpen ? (
          <ChevronUp size={20} color="#C39BD3" />
        ) : (
          <ChevronDown size={20} color="#C39BD3" />
        )}
      </Pressable>

      {isOpen && (
        <View className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
          <ScrollView className="p-2">
            {normalizedOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleToggleOption(option.value)}
                className="flex-row items-center p-2"
              >
                <View
                  className={`w-5 h-5 border rounded mr-2 items-center justify-center ${
                    value.includes(option.value)
                      ? "bg-brand border-brand"
                      : "border-gray-300"
                  }`}
                >
                  {value.includes(option.value) && (
                    <Check size={14} color="#FFFFFF" />
                  )}
                </View>
                <Text>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
