import { memo } from "react";
import type { MessageContent, Role } from "../types";
import { Box, Flex } from "@mantine/core";
import { OnePart } from "./OnePart";
import { MessageActions } from "./MessageActions";
import { Suggestions } from "../suggestions/Suggestions";

interface OneMessageProps {
  msgId: string;
  relevant: boolean | null;
  role: Role;
  content: MessageContent;
  threadId?: string;
  setIsLoading: (val: boolean) => void;
  appendMessage: (role: Role, newMsg: MessageContent) => void;
  updateRelevancy: (msgId: string, relevant: boolean | null) => void;
}

export const OneMessage = memo(
  ({
    msgId,
    relevant,
    role,
    content,
    threadId,
    setIsLoading,
    appendMessage,
    updateRelevancy,
  }: OneMessageProps) => {
    if (!content) return null;

    const { parts, suggestions } = content;

    return (
      <Flex
        my={15}
        direction="column"
        align={role === "user" ? "flex-end" : "flex-start"}
        // w={"100%"}
        // maw={"100%"}
      >
        {parts.map((part, index) => (
          <Box
            key={index}
            style={{
              width: "fit-content",
              maxWidth: "70%",
              borderRadius: "4px",
              marginBottom: 10,
            }}
          >
            <OnePart part={part} />
          </Box>
        ))}
        {role === "assistant" && (
          <MessageActions
            msgId={msgId}
            relevant={relevant}
            partsString={JSON.stringify(parts, null, 2)}
            updateRelevancy={updateRelevancy}
          />
        )}
        {suggestions.length > 0 && (
          <Suggestions
            suggestions={suggestions}
            threadId={threadId}
            setIsLoading={setIsLoading}
            appendMessage={appendMessage}
          />
        )}
      </Flex>
    );
  },
);
