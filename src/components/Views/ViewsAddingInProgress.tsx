import { Group, List, Loader, Text } from "@mantine/core";
import { useCustomColors } from "../../customHooks/useCustomColors";

interface ViewsAddingInProgressProps {
  title: string;
}

export const ViewsAddingInProgress = ({
  title,
}: ViewsAddingInProgressProps) => {
  const { borderColor } = useCustomColors();

  return (
    <List.Item
      styles={{
        itemWrapper: { width: "100%" },
        itemLabel: { display: "block", width: "100%" },
        item: { borderTop: `1px solid ${borderColor}` },
      }}
      h="36px"
    >
      <Group h="36px" px="15px" align="center" justify="space-between">
        <Text size="0.875rem" c="dimmed">
          {title}
        </Text>
        <Loader size={14} />
      </Group>
    </List.Item>
  );
};
