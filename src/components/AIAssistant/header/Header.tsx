import { Flex, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

export const Header = () => {
  return (
    <Flex
      direction="row"
      align="center"
      h={48}
      pl={10}
      style={{ paddingLeft: "10px" }}
    >
      <Text c="dimmed">AI Assistant</Text>
      <IconChevronRight size={16} style={{ marginLeft: "5px" }} />
      <Text>New Chat</Text>
    </Flex>
  );
};
