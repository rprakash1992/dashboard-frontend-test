import { Flex, Text } from "@mantine/core";
import { Suggestions } from "../suggestions/Suggestions";
import type { MessageContent, Role, Suggestion } from "../types";

interface GetStartedProps {
  threadId: string | undefined;
  setIsLoading: (val: boolean) => void;
  appendMessage: (role: Role, newMsg: MessageContent) => void;
}

// const suggestions = ["What are my top products.", "Show me revenue trends."];
const suggestions: Suggestion[] = [
  {
    title: "Create a 3D Wcax Report.",
    description: "Create a 3D Wcax Report.",
  },
  {
    title: "What is the status of my Bracket NVH Simulation.",
    description: "What is the status of my Bracket NVH Simulation.",
  },
];

export const GetStarted = ({
  threadId,
  setIsLoading,
  appendMessage,
}: GetStartedProps) => {
  return (
    <Flex w="100%" h="100%" direction="column" pr="xs">
      <Flex w="100%" h="100%" justify="center" align="center">
        <Text>Hi, How can I help you today?</Text>
      </Flex>
      <Suggestions
        threadId={threadId}
        suggestions={suggestions}
        setIsLoading={setIsLoading}
        appendMessage={appendMessage}
      />
    </Flex>
  );
};
