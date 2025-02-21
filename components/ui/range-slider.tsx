import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Text } from "./text";

interface RangeSliderProps {
  min: number;
  max: number;
  range: [number, number];
  onChange: (range: [number, number]) => void;
  step?: number;
  className?: string;
}

export function RangeSlider({
  min,
  max,
  range,
  onChange,
  step = 1,
  className = "",
}: RangeSliderProps) {
  const [localRange, setLocalRange] = useState<[number, number]>(range);
  const sliderWidth = useSharedValue(0);
  const leftThumbPos = useSharedValue(0);
  const rightThumbPos = useSharedValue(0);

  const updateRange = useCallback(
    (newRange: [number, number]) => {
      setLocalRange(newRange);
      onChange(newRange);
    },
    [onChange]
  );

  useEffect(() => {
    if (sliderWidth.value > 0) {
      const leftPos = ((range[0] - min) / (max - min)) * sliderWidth.value;
      const rightPos = ((range[1] - min) / (max - min)) * sliderWidth.value;
      leftThumbPos.value = leftPos;
      rightThumbPos.value = rightPos;
    }
  }, [range, min, max, sliderWidth.value]);

  const leftThumbGesture = Gesture.Pan().onChange((e) => {
    const newPos = Math.max(
      0,
      Math.min(rightThumbPos.value - 20, leftThumbPos.value + e.changeX)
    );
    leftThumbPos.value = newPos;

    const percentage = newPos / sliderWidth.value;
    const value = Math.round((percentage * (max - min) + min) / step) * step;
    runOnJS(updateRange)([value, localRange[1]]);
  });

  const rightThumbGesture = Gesture.Pan().onChange((e) => {
    const newPos = Math.min(
      sliderWidth.value,
      Math.max(leftThumbPos.value + 20, rightThumbPos.value + e.changeX)
    );
    rightThumbPos.value = newPos;

    const percentage = newPos / sliderWidth.value;
    const value = Math.round((percentage * (max - min) + min) / step) * step;
    runOnJS(updateRange)([localRange[0], value]);
  });

  const leftThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftThumbPos.value }],
  }));

  const rightThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightThumbPos.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    left: leftThumbPos.value,
    right: sliderWidth.value - rightThumbPos.value,
  }));

  return (
    <GestureHandlerRootView className={className}>
      <View
        className="h-8 justify-center"
        onLayout={(e) => {
          sliderWidth.value = e.nativeEvent.layout.width;
        }}
      >
        <View className="h-1 bg-gray-200 rounded-full">
          <Animated.View
            className="absolute h-full bg-brand rounded-full "
            style={progressStyle}
          />
        </View>

        <GestureDetector gesture={leftThumbGesture}>
          <Animated.View
            className="absolute w-10 h-10 bg-white rounded-full shadow-sm items-center justify-center "
            style={leftThumbStyle}
          >
            <Text>{localRange[0]}</Text>
          </Animated.View>
        </GestureDetector>

        <GestureDetector gesture={rightThumbGesture}>
          <Animated.View
            className="absolute w-10 h-10 bg-white rounded-full shadow-sm items-center justify-center -ml-3"
            style={rightThumbStyle}
          >
            <Text>{localRange[1]}</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}
