const tintColor = "#FF5733";

export const NAV_THEME = {
  light: {
    background: "hsl(0 0% 100%)", // background
    border: "hsl(240 5.9% 90%)", // border
    card: "hsl(0 0% 100%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "#41D29B", // primary
    text: "hsl(240 10% 3.9%)", // foreground
    tint: tintColor,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColor,
  },
  dark: {
    background: "hsl(240 10% 3.9%)", // background
    tint: tintColor,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColor,
    border: "hsl(240 3.7% 15.9%)", // border
    card: "hsl(240 10% 3.9%)", // card
    notification: "hsl(0 72% 51%)", // destructive
    primary: "#41D29B", // primary
    text: "hsl(0 0% 98%)", // foreground
  },
};

export default {
  NAV_THEME,
};
