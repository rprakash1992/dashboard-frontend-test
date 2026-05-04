import { Box, Progress, Text } from "@mantine/core";

type UploadCompletedProps = {
  fileName: string;
};

export const UploadCompleted = ({ fileName }: UploadCompletedProps) => {
  return (
    <Box>
      <Text size="sm" mb="5px">
        {fileName}
      </Text>
      <Progress w={"100%"} value={100} />
      <Text size="sm" mt="5px">
        File uploaded successfully!!
      </Text>
    </Box>
  );
};
