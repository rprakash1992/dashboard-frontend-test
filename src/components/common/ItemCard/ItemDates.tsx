import { Box, Space, Text } from "@mantine/core";
import { getTimeLapsed } from "../../../utils/misc";

interface InfoProps {
  text: string;
}

function ItemInfo({ text }: InfoProps) {
  return (
    <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
      {text}
    </Text>
  );
}

export const ItemDates = ({
  lastModifiedAt,
  createdAt,
}: {
  lastModifiedAt: string;
  createdAt: string;
}) => (
  <Box>
    <ItemInfo text={`Modified: ${getTimeLapsed(lastModifiedAt as string)}`} />
    <Space h={5} />
    <ItemInfo text={`Created: ${getTimeLapsed(createdAt)}`} />
  </Box>
);
