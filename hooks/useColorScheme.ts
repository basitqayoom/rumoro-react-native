import { useColorScheme as useNativewindColorScheme } from "react-native";

export function useColorScheme(): "light" | "dark" {
  return useNativewindColorScheme() ?? "light";
}
