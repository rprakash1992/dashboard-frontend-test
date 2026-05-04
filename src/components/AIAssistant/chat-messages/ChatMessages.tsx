import { memo, useLayoutEffect, useRef } from "react";
import { Box, ScrollArea } from "@mantine/core";
import { RenderMessages } from "./RenderMessages";
import { GetStarted } from "../get-started/GetStarted";
import type { Message, MessageContent, Role } from "../types";

export const ChatMessages = memo(
  ({
    messages,
    isLoading,
    threadId,
    setIsLoading,
    appendMessage,
    updateRelevancy,
  }: {
    messages: Message[];
    isLoading: boolean;
    threadId?: string;
    setIsLoading: (val: boolean) => void;
    appendMessage: (role: Role, newMsg: MessageContent) => void;
    updateRelevancy: (msgId: string, relevant: boolean | null) => void;
  }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      if (!bottomRef.current) return;

      bottomRef.current.scrollIntoView({ behavior: "smooth" });

      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }, [messages.length]);

    return (
      <Box style={{ height: "calc(100% - 42px)", width: "100%" }}>
        {/* {messages.length > 0 ? (
        <RenderMessages messages={messages} isLoading={isLoading} />
      ) : (
        <GetStarted />
      )} */}
        {messages.length > 0 ? (
          <ScrollArea h="100%" w="100%" offsetScrollbars scrollbars="y">
            <RenderMessages
              messages={messages}
              isLoading={isLoading}
              threadId={threadId}
              setIsLoading={setIsLoading}
              appendMessage={appendMessage}
              updateRelevancy={updateRelevancy}
            />
            <Box ref={bottomRef} />
          </ScrollArea>
        ) : (
          <GetStarted
            threadId={threadId}
            setIsLoading={setIsLoading}
            appendMessage={appendMessage}
          />
        )}
      </Box>
    );
  },
);
