import { StyleSheet } from "react-native";

export const generalStyles = StyleSheet.create({
  text: {
    fontFamily: "Roboto_700Bold",
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    lineHeight: 36,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  image: {
    width: 150,
    aspectRatio: 1,
  },
  textContainer: {
    flex: 0.4,
    paddingHorizontal: 5,
    width: "100%",
    gap: 12,
  },
  titleBold: {
    fontSize: 42,
    lineHeight: 54,
    textAlign: "left",
  },
  description: {
    fontSize: 16,
    opacity: 0.8,
    lineHeight: 24,
  },
});
