import { Box, Button, Progress, Space, Text } from "@mantine/core";

type UploadFailedProps = {
  fileName: string;
  percentageProgress: number;
  uploadFile: () => void;
};

export const UploadFailed = ({ fileName, percentageProgress, uploadFile }: UploadFailedProps) => {
  return (
    <Box>
      <Text size="sm" mb="5px">
        {fileName}
      </Text>
      <Progress w={"100%"} value={percentageProgress} />
      <Box
        mt="5px"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text size="sm" c="red">
          Upload Failed
        </Text>
        <Space w="sm" />
        <Button variant="subtle" onClick={uploadFile}>
          Retry
        </Button>
      </Box>
    </Box>
  );
};
