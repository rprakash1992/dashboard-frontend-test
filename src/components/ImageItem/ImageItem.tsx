import { Box, Flex, Image, Text } from "@mantine/core";

interface ImageItemProps {
  imageFile: string;
  handleClick?: (component: string) => void;
}

export const ImageItem = ({ imageFile }: ImageItemProps) => {
  return (
    <Box mx="auto">
      {imageFile ? (
        <Image src={imageFile} />
      ) : (
        <Flex justify="center" align="center">
          <Text>No Image</Text>
        </Flex>
      )}
    </Box>
  );
};
