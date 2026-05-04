import { Avatar, Card, Flex, Text, Box, Tooltip } from "@mantine/core";
import { formatDateToString, formatAMPM } from "../../utils/misc";
import type { ViewActivityType } from "../../store/viewSlice";
import { useCustomColors } from "../../customHooks/useCustomColors";

interface ActivityCardType {
  ele: ViewActivityType;
  profileDetails: any;
}

export const ActivityCard = ({ ele, profileDetails }: ActivityCardType) => {
  const { borderColor } = useCustomColors();

  const content = ele?.content?.text;
  const date = formatDateToString(ele?.content?.time);
  const time = formatAMPM(ele?.content?.time);
  const profileSrc = profileDetails?.picture;
  const userName = profileDetails?.name;

  return (
    <Card
      mb="15px"
      shadow="sm"
      radius="sm"
      p="sm"
      withBorder
      style={{
        overflow: "visible",
        borderColor,
      }}
    >
      <Flex justify="flex-start" align="flex-start" direction="row" gap="xs">
        <Box>
          <Tooltip label={userName}>
            <Avatar src={profileSrc} size={30} radius="lg" />
          </Tooltip>
        </Box>
        <Box w={"100%"}>
          <Box p={5}>
            <Text fz="sm" mb={3}>
              {content}
            </Text>
          </Box>
          <Text mb={3} size="xs" color="dimmed" px={5}>
            {date} at {time}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
};
