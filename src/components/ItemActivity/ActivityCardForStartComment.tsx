import { useState } from "react";
import {
  useMantineColorScheme,
  Avatar,
  Paper,
  Input,
  Card,
  Flex,
  Text,
  Box,
} from "@mantine/core";

import { formatDateToString, formatAMPM } from "../../utils/misc";
import { VCSendIcon } from "../../assets/icons";

export const ActivityCardForStartComment = ({
  ele,
  profileDetails,
  handleKeyDown,
  onCancelAddCommentClick,
}: any) => {
  const [comment, setComment] = useState<string>("");
  const { colorScheme } = useMantineColorScheme();
  const paperBg = colorScheme === "dark" ? "#37393f73" : "#d0d4d847";

  const eleId = ele?.id;
  const profileSrc = profileDetails[ele?.content?.userId]?.picture;
  const userName = profileDetails[ele?.content?.userId]?.name;
  const prevActivityContent = ele?.content?.text;
  const prevActivityTime = formatAMPM(ele?.content.time);
  const prevActivityDate = formatDateToString(ele?.content.time);

  return (
    <Card key={eleId} shadow="sm" padding="sm" radius="sm" withBorder>
      <Flex justify="flex-start" align="flex-start" direction="row" gap="xs">
        <Box>
          <Avatar title={userName} src={profileSrc} size={30} radius="lg" />
        </Box>
        <Box w={"100%"}>
          <Box p={5}>
            <Paper
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
          </Box>
          <Input
            rightSection={
              <VCSendIcon
                onClick={() =>
                  handleKeyDown(
                    null,
                    ele?.prev_action,
                    comment,
                    ele?.content?.contentType === "startComment"
                      ? "comment"
                      : "reply",
                    "postComment"
                  )
                }
                size={15}
                cursor={"pointer"}
              />
            }
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) =>
              handleKeyDown(
                e,
                ele?.prev_action,
                comment,
                ele?.content?.contentType === "startComment"
                  ? "comment"
                  : "reply"
              )
            }
          />
          <Text
            fz="sm"
            td="underline"
            style={{ cursor: "pointer" }}
            onClick={() => onCancelAddCommentClick(ele)}
            ta="right"
          >
            Cancel
          </Text>
        </Box>
      </Flex>
    </Card>
  );
};
