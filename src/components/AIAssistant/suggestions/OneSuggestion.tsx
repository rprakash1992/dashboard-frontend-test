import { Card, HoverCard, Text } from "@mantine/core";

interface OneSuggestionProps {
  title: string;
  description: string;
  handleClick: () => void;
}

export const OneSuggestion = ({
  title,
  description,
  handleClick,
}: OneSuggestionProps) => (
  <HoverCard width={280} shadow="md">
    <HoverCard.Target>
      <Card
        onClick={handleClick}
        withBorder
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "40px",
          cursor: "pointer",
        }}
      >
        <Text size="14px">{title}</Text>
      </Card>
    </HoverCard.Target>
    <HoverCard.Dropdown>
      <Text size="sm">{description}</Text>
    </HoverCard.Dropdown>
  </HoverCard>
);
