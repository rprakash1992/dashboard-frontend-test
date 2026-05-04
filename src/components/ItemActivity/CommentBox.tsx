import { useState } from "react";
import { Space, Input, Text, Card, Box } from "@mantine/core";

import { useStore } from "../../store";
import { VCSendIcon } from "../../assets/icons";

export const CommentBox = ({ handleKeyDown }: any) => {
  const setShowCommentBox = useStore((state) => state.setShowCommentBox);
  const [comment, setComment] = useState<string>("");

  return (
    <Card shadow="sm" padding="sm" radius="sm" withBorder>
      <Box>
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => {
            handleKeyDown(e, null, comment, "freshComment");
            if (e.key === "Enter") {
              setComment("");
            }
          }}
          rightSection={
            <VCSendIcon
              onClick={() => {
                handleKeyDown(
                  null,
                  null,
                  comment,
                  "freshComment",
                  "postComment"
                );
                setComment("");
              }}
              size={15}
              cursor={"pointer"}
            />
          }
          placeholder="Type comment here..."
        />
        <Space mt={5} />
        <Text
          fz="sm"
          td="underline"
          style={{ cursor: "pointer" }}
          ta="right"
          onClick={() => setShowCommentBox(false)}
        >
          Cancel
        </Text>
      </Box>
    </Card>
  );
};
