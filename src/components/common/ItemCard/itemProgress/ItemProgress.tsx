import { Box, Progress, Text } from "@mantine/core";

export const ItemProgress = ({ label }: { label: string }) => {
  return (
    <Box
      style={{
        height: 84,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Text size="xs" c="#3f8be4">
        {label}
      </Text>
      <Progress mt="5px" w={"100%"} value={100} animated />
    </Box>
  );
};
