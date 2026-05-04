import { Text } from "@mantine/core";

export const Label = ({ label }: { label: string }) => {
  return (
    <Text
      style={{
        display: "inline-block",
        fontWeight: 500,
        wordBreak: "break-word",
        cursor: "default",
        WebkitTapHighlightColor: "transparent",
        fontSize: "var(--input-label-size, var(--mantine-font-size-sm))",
        lineHeight: "var(--mantine-line-height)",
      }}
    >
      {label}:
    </Text>
  );
};
