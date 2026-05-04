import { Box } from "@mantine/core";
import { ChatInput } from "./chat-input/ChatInput";
import { ChatMessages } from "./chat-messages/ChatMessages";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { useCallback, useEffect, useState } from "react";
import type { Message, MessageContent, Role } from "./types";
import { useStore } from "../../store";
import { aiAssistantApi } from "../../apiActions/aiAssistant";
import { AlertMsgType } from "../../store/actionSlice";

export const AiAssistant = ({
  projectId: threadId,
}: {
  projectId?: string;
}) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingChats, setIsFetchingChats] = useState<boolean>(false);

  useEffect(() => {
    startNewThread();
  }, []);

  const startNewThread = async () => {
    try {
      setIsFetchingChats(true);
      const { data, error } = await aiAssistantApi.startThread(threadId);

      if (error) {
        console.error(error);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      setMessages(data.thread_data);
    } catch (error: unknown) {
      console.error(error);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setIsFetchingChats(false);
    }
  };

  const appendMessage = useCallback((role: Role, newMsg: MessageContent) => {
    const newMessage = {
      id: String(new Date().getTime()),
      role,
      content: newMsg,
      relevant: null,
    };

    setMessages((prevMsgs) => [...prevMsgs, newMessage]);
  }, []);

  const updateRelevancy = useCallback(
    (msgId: string, relevant: boolean | null) => {
      setMessages((prevMsgs) =>
        prevMsgs.map((msg) => (msg.id === msgId ? { ...msg, relevant } : msg)),
      );
    },
    [],
  );

  if (isFetchingChats) {
    return <LoadingComponent />;
  }

  return (
    <MaxWidthContainer>
      <Box w="100%" h="100%" pr={0} style={{ position: "relative" }}>
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          threadId={threadId}
          setIsLoading={setIsLoading}
          appendMessage={appendMessage}
          updateRelevancy={updateRelevancy}
        />
        <ChatInput
          threadId={threadId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          appendMessage={appendMessage}
        />
      </Box>
    </MaxWidthContainer>
  );
};
