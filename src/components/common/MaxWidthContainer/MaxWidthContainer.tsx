import { Box, Flex } from "@mantine/core";

export const MaxWidthContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Flex justify="center" align="center" direction="column" w="100%" h="100%">
      <Box maw={500} w="100%" h="100%" p="sm">
        {children}
      </Box>
    </Flex>
  );
};
