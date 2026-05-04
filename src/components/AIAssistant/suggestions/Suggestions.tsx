import { useEffect, useRef, useState } from "react";
import { Grid } from "@mantine/core";
import type { MessageContent, Role, Suggestion } from "../types";
import { aiAssistantApi } from "../../../apiActions/aiAssistant";
import { OneSuggestion } from "./OneSuggestion";
import { useStore } from "../../../store";
import { AlertMsgType } from "../../../store/actionSlice";

interface SuggestionsProps {
  suggestions: Suggestion[];
  threadId?: string;
  setIsLoading: (val: boolean) => void;
  appendMessage: (role: Role, newMsg: MessageContent) => void;
}

export const Suggestions = ({
  suggestions,
  threadId,
  setIsLoading,
  appendMessage,
}: SuggestionsProps) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [width, setWidth] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = document.querySelector(
      ".flexlayout__tab_border_left",
    ) as HTMLElement;

    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setWidth(width);
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const handleClick = async (input: string) => {
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
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid py="10px" w="100%" ref={ref}>
      {suggestions.map((suggestion, index) => (
        <Grid.Col span={width < 500 ? 12 : 6} key={index}>
          <OneSuggestion
            title={suggestion.title}
            description={suggestion.description}
            handleClick={() => handleClick(suggestion.title)}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};
