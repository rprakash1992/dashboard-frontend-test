import { Box, Card, Progress, Text } from "@mantine/core";
import { useStore } from "../../../../store";
import type { FileUploadDetail } from "../../../../store/fileSlice";

function ItemUploadInProgress({ itemId }: { itemId: string }) {
  const fileUploads = useStore((state) => state.fileUploads);

  const fileUploadDetails = fileUploads[itemId];

  const convertTime = (timeInMs: number) => {
    let returnTime = timeInMs;
    let returnUnit = "ms";

    if (returnTime > 1000) {
      returnTime = Math.floor(returnTime / 1000);
      returnUnit = "sec";
    }

    if (returnTime > 60) {
      returnTime = Math.floor(returnTime / 60);
      returnUnit = "min";
    }

    if (returnTime > 60) {
      returnTime = Math.floor(returnTime / 60);
      returnUnit = "hr";
    }

    return { time: returnTime, unit: returnUnit };
  };

  const getPercentProgress = (data: FileUploadDetail) => {
    const { totalParts, uploadedParts } = data;

    return uploadedParts > 0 && totalParts > 0
      ? (uploadedParts * 100) / totalParts
      : 0;
  };

  return (
    <Card p="xs">
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text size="xs" c="#3f8be4" miw="60px">
          Upload In Progress
        </Text>
        <Text size="xs" mt="5px">
          {Math.floor(getPercentProgress(fileUploadDetails)) ?? 0}% Done
        </Text>
      </Box>
      <Box mt="5px">
        <Progress
          w={"100%"}
          value={getPercentProgress(fileUploadDetails)}
          animated
        />
        <Text size="xs" mt="5px">
          Est. Time Remaining:
          {fileUploadDetails?.isCalculatingEstimatedTime
            ? " Calculating..."
            : ` ${convertTime(fileUploadDetails?.estimatedTime).time} ${
                convertTime(fileUploadDetails?.estimatedTime).unit
              }`}
        </Text>
      </Box>
    </Card>
  );
}

export default ItemUploadInProgress;
