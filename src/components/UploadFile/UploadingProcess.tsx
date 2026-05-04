import { Box } from "@mantine/core";
import { UploadFailed } from "./UploadFailed";
import { UploadCompleted } from "./UploadCompleted";
import { UploadInProgress } from "./UploadInProgress";

type UploadingProcessProps = {
  fileName: string;
  fileSize: number;
  fileSizeUnit: string;
  percentageProgress: number;
  uploadingStatus: string | null;
  isCalculatingEstimatedTime: any;
  estTimeRemaining: any;
  uploadFile: () => void;
};

export const UploadingProcess = ({
  fileName,
  fileSize,
  fileSizeUnit,
  percentageProgress,
  uploadingStatus,
  isCalculatingEstimatedTime,
  estTimeRemaining,
  uploadFile,
}: UploadingProcessProps) => {
  return (
    <Box>
      {uploadingStatus === "failed" && (
        <UploadFailed
          fileName={fileName}
          percentageProgress={percentageProgress}
          uploadFile={uploadFile}
        />
      )}
      {uploadingStatus === "completed" && (
        <UploadCompleted fileName={fileName} />
      )}
      {uploadingStatus === "progress" && (
        <UploadInProgress
          fileName={fileName}
          fileSize={fileSize}
          fileSizeUnit={fileSizeUnit}
          percentageProgress={percentageProgress}
          isCalculatingEstimatedTime={isCalculatingEstimatedTime}
          estTimeRemaining={estTimeRemaining}
        />
      )}
    </Box>
  );
};
