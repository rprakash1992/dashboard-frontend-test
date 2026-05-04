import { Avatar, Card, Flex, Text, Box } from "@mantine/core";
import { formatDateToString, formatAMPM } from "../../utils/misc";
import { useCustomColors } from "../../customHooks/useCustomColors";
import { VCMessageIcon, VCReplyIcon } from "../../assets/icons";
import type { ActivityType } from "./ItemActivity";

interface ActivityCardType {
  ele: ActivityType;
  profileDetails: any;
  onAddCommentClick: (a: any, b: any) => void;
  highlightActivity: any;
  fadeIn: any;
  fadeOut: any;
  activityType: string;
}

export const ActivityCard = ({
  ele,
  profileDetails,
  onAddCommentClick,
  highlightActivity,
  fadeIn,
  fadeOut,
  activityType,
}: ActivityCardType) => {
  const eleId = ele?.id;
  const { borderColor } = useCustomColors();

  const content = ele?.content;
  const date = formatDateToString(ele?.timestamp);
  const time = formatAMPM(ele?.timestamp);
  const profileSrc = profileDetails[ele?.user_id]?.picture;
  const userName = profileDetails[ele?.user_id]?.name;

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
            <Text fz="sm" mb={3}>
              {content}
            </Text>
          </Box>
          <Text mb={3} size="xs" color="dimmed" px={5}>
            {date} at {time}
          </Text>
          {activityType === "activity" && false && (
            <Text
              fz="sm"
              td="underline"
              style={{ cursor: "pointer" }}
              onClick={() => onAddCommentClick(ele, "startComment")}
              ta="right"
            >
              <VCMessageIcon size={20} />
            </Text>
          )}
          {activityType === "freshComment" && false && (
            <Text
              fz="sm"
              td="underline"
              style={{ cursor: "pointer" }}
              onClick={() => onAddCommentClick(ele, "startReply")}
              ta="right"
            >
              <VCReplyIcon size={20} />
            </Text>
          )}
        </Box>
      </Flex>
    </Card>
  );
};
