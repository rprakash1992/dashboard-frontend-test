import { Box } from "@mantine/core";

export const VideoViewer = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <Box w="100%" h="100%">
      <video
        controls
        src={videoUrl}
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </Box>
  );
};
