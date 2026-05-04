import { useMantineColorScheme } from "@mantine/core";

export const useCustomColors = () => {
  const { colorScheme } = useMantineColorScheme();
  // const borderColor = colorScheme === "dark" ? "#424242" : "#dee2e6";
  const borderColor = colorScheme === "dark" ? "#333333" : "#e0e0e0";
  const rightWindowBgColor = colorScheme === "dark" ? "#353434" : "#f2f2f2";
  const shadowColor = colorScheme === "dark" ? "black" : "#828282";
  const hoverColor = colorScheme === "dark" ? "#333" : "#e2e2e2";
  // const hoverColor = colorScheme === "dark" ? "#373A40" : "#e9ecef";#dcdcdc
  // const iconColor = colorScheme === "dark" ? "#c9c9c9" : "#888989";
  const iconColor = colorScheme === "dark" ? "#c9c9c9" : "#000000";

  return {
    borderColor,
    rightWindowBgColor,
    shadowColor,
    hoverColor,
    iconColor,
  };
};
