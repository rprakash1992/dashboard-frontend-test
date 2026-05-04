import { Box, Image } from "@mantine/core";

export const ImageViewer = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <Box w="100%" h="100%">
      <Image
        src={imageUrl}
        style={{ maxWidth: "100%", maxHeight: "100%" }}
        alt="image"
      />
    </Box>
  );
};
