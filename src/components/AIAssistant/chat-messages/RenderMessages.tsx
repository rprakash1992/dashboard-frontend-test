import { Box, Text } from "@mantine/core";
import type { Message, MessageContent, Role } from "../types";
import { OneMessage } from "./OneMessage";

interface RenderMessagesProps {
  messages: Message[];
  isLoading: boolean;
  threadId?: string;
  setIsLoading: (val: boolean) => void;
  appendMessage: (role: Role, newMsg: MessageContent) => void;
  updateRelevancy: (msgId: string, relevant: boolean | null) => void;
}

export const RenderMessages = ({
  messages,
  isLoading,
  threadId,
  setIsLoading,
  appendMessage,
  updateRelevancy,
}: RenderMessagesProps) => {
  return (
    <Box>
      {messages.map((message) => (
        <OneMessage
          key={message.id}
          relevant={message.relevant}
          msgId={message.id}
          role={message.role}
          content={message.content}
          threadId={threadId}
          setIsLoading={setIsLoading}
          appendMessage={appendMessage}
          updateRelevancy={updateRelevancy}
        />
      ))}
      {isLoading && <Text>Assistant is typing...</Text>}
    </Box>
  );
};
