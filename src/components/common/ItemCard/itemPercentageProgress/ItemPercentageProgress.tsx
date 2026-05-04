import { Box, Progress, Text } from "@mantine/core";

export const ItemPercentageProgress = ({
  progress,
  label,
}: {
  progress: number;
  label: string;
}) => {
  return (
    <Box
      style={{
        height: 84,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text size="xs" c="#3f8be4" miw="60px">
          {label}
        </Text>
        <Text size="xs" mt="5px">
          {Math.floor(progress) ?? 0}% Done
        </Text>
      </Box>
      <Progress mt="5px" w={"100%"} value={progress} animated />
    </Box>
  );
};
