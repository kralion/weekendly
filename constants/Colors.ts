/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

const DEFAULTS = {
  primary1: "#FF5733",
  primary2: "#006FE7",
};

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    ...DEFAULTS,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    ...DEFAULTS,
  },
};
