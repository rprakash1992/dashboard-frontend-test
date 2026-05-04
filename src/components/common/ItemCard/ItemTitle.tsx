import { Text, Tooltip } from "@mantine/core";

interface TitleProps {
  title: string;
  showTooltip?: boolean;
}

export const ItemTitle = ({ title, showTooltip }: TitleProps) => {
  return showTooltip ? (
    <Tooltip label={title}>
      <Text
        fw={500}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: 1.3,
          textTransform: "capitalize",
        }}
      >
        {title}
      </Text>
    </Tooltip>
  ) : (
    <Text
      fw={500}
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: 1.3,
        textTransform: "capitalize",
      }}
    >
      {title}
    </Text>
  );
};
