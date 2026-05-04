import { Box } from "@mantine/core";

export const VideoComponent = ({ data }: any) => {
  return (
    <Box>
      <video controls style={{ maxWidth: "100%" }} src={data} />
    </Box>
  );
};
