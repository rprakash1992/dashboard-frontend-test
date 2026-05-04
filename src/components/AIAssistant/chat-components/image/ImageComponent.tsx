import { Box, Image } from "@mantine/core";

export const ImageComponent = ({ data }: { data: string }) => {
  return (
    <Box>
      <Image src={data} alt="Generated" style={{ maxWidth: "100%" }} />
    </Box>
  );
};
