import {
  useMantineColorScheme,
  Avatar,
  Paper,
  Card,
  Flex,
  Text,
  Box,
} from "@mantine/core";

import { formatDateToString, formatAMPM } from "../../utils/misc";
import { useCustomColors } from "../../customHooks/useCustomColors";
import { VCReplyIcon } from "../../assets/icons";

export const ActivityCardForComment = ({
  ele,
  profileDetails,
  onAddCommentClick,
  prevActivity,
  scrollToId,
  highlightActivity,
  fadeIn,
  fadeOut,
}: any) => {
  const { colorScheme } = useMantineColorScheme();
  const paperBg = colorScheme === "dark" ? "#37393f73" : "#d0d4d847";
  const { borderColor } = useCustomColors();

  const content = ele?.content.text;
  const date = formatDateToString(ele?.content?.time);
  const time = formatAMPM(ele?.content?.time);
  const profileSrc = profileDetails[ele?.content?.userId]?.picture;
  const userName = profileDetails[ele?.content?.userId]?.name;
  const eleId = ele?.id;
  const prevActivityContent = prevActivity?.content?.text;
  const prevActivityTime = formatAMPM(prevActivity?.content.time);
  const prevActivityDate = formatDateToString(prevActivity?.content.time);
  const prevActivityId = prevActivity?.id;

  return (
    <Card
      className={highlightActivity === eleId ? fadeIn : fadeOut}
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
          <Avatar title={userName} src={profileSrc} size={30} radius="lg" />
        </Box>
        <Box w={"100%"}>
          <Box p={5}>
            <Paper
              onClick={() => scrollToId(prevActivityId)}
              bg={paperBg}
              p={5}
              style={{
                borderRadius: 0,
                cursor: "pointer",
              }}
            >
              <Text fz="xs" mb={3}>
                {prevActivityContent}
              </Text>
              <Text mb={3} size="xs" color="dimmed">
                {prevActivityDate} at {prevActivityTime}
              </Text>
            </Paper>
            <Text fz="sm" mb={3}>
              {content}
            </Text>
            <Text mb={3} size="xs" color="dimmed">
              {date} at {time}
            </Text>
          </Box>
          <Text
            fz="sm"
            td="underline"
            style={{ cursor: "pointer" }}
            onClick={() => onAddCommentClick(ele, "startReply")}
            ta="right"
          >
            <VCReplyIcon size={20} />
          </Text>
        </Box>
      </Flex>
    </Card>
  );
};
