import { useState } from "react";
import { Flex, TextInput } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { aiAssistantApi } from "../../../apiActions/aiAssistant";
import type { MessageContent, Role } from "../types";
import { useStore } from "../../../store";
import { AlertMsgType } from "../../../store/actionSlice";

export const ChatInput = ({
  threadId,
  isLoading,
  setIsLoading,
  appendMessage,
}: {
  threadId?: string;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  appendMessage: (role: Role, newMsg: MessageContent) => void;
}) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: MessageContent = {
      parts: [
        {
          type: "text",
          data: input,
        },
      ],
      suggestions: [],
    };

    appendMessage("user", userMessage);

    setIsLoading(true);

    try {
      const { data, error } = await aiAssistantApi.sendPrompt(threadId, input);

      if (error) {
        console.error(error);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      appendMessage("assistant", data);
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <Flex direction="row" align="center" pr="xs">
      <TextInput
        type="text"
        disabled={isLoading}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type your message here..."
        styles={{
          root: {
            flex: 1,
          },
          input: {
            minHeight: "42px",
            height: "42px",
          },
        }}
        rightSection={<IconSend size={20} />}
      />
    </Flex>
  );
};
