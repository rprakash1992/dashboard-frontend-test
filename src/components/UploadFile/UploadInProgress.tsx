import { Box, Progress, Text } from "@mantine/core";

type UploadInProgressProps = {
  fileName: string;
  fileSize: number;
  fileSizeUnit: string;
  percentageProgress: number;
  isCalculatingEstimatedTime: any;
  estTimeRemaining: any;
};

export const UploadInProgress = ({
  fileName,
  fileSize,
  fileSizeUnit,
  percentageProgress,
  isCalculatingEstimatedTime,
  estTimeRemaining,
}: UploadInProgressProps) => {
  return (
    <Box style={{ display: "flex", flex: 1, flexDirection: "column" }}>
      <Text size="sm" mb="5px">
        {fileName} ({fileSize}{" "}{fileSizeUnit})
      </Text>
      <Progress w={"100%"} value={percentageProgress} animated />
      <Box mt="5px">
        <Text size="sm">
          Upload in progress...{Math.floor(percentageProgress)}% Uploaded
        </Text>
        {/* <Text size="sm">
          {((fileSize * percentageProgress) / 100).toFixed(2)}/{fileSize}{" "}
          {fileSizeUnit} Uploaded
        </Text> */}
        <Text size="sm">
          Esitmated Time:{" "}
          {isCalculatingEstimatedTime
            ? "Calculating..."
            : `${estTimeRemaining?.time} ${estTimeRemaining.unit} remaining`}
        </Text>
      </Box>
    </Box>
  );
};
