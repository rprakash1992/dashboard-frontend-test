import { Flex, Loader, Text } from "@mantine/core";

export const LoadingComponent = () => {
  return (
    <Flex
      w="100%"
      h="100%"
      justify="center"
      align="center"
      direction="column"
      gap="xs"
    >
      <Loader />
      <Text>Loading. Please wait...</Text>
    </Flex>
  );
};
