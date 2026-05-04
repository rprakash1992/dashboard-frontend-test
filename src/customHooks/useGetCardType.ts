import {
  type FileUploadDetail,
  FileUploadStatusEnum,
} from "../store/fileSlice";
import { ItemTypeEnum } from "../types";
import { type Job, RunDetailsPhaseEnum, JobTypeEnum } from "../types";

export const useGetCardType = (
  itemType: string,
  fileUploadDetails: FileUploadDetail,
  runDetails: Job | undefined,
  jobDetails: Job | null,
) => {
  let cardType = "default";

  if (itemType === ItemTypeEnum.FILE) {
    if (fileUploadDetails && Object.keys(fileUploadDetails).length > 0) {
      const fileUploadStatus = fileUploadDetails?.status;
      if (fileUploadStatus === FileUploadStatusEnum.FAILED) {
        cardType = "fileUploadFailed";
      } else if (fileUploadStatus === FileUploadStatusEnum.PROGRESS) {
        cardType = "fileUploadProgress";
      }
    }

    if (runDetails?.job_type === JobTypeEnum.ZIP_TO_FOLDER) {
      cardType = "fileExtraction";
    }

    if (runDetails?.job_type === JobTypeEnum.FOLDER_TO_ZIP) {
      cardType = "fileCompression";
    }
  }

  if (itemType === ItemTypeEnum.JOB) {
    if (jobDetails && Object.keys(jobDetails).length > 0) {
      const jobStatus = jobDetails?.run_details?.phase;
      // if (jobStatus ===  "SCHEDULED" || jobStatus === "PENDING") {
      if (jobStatus === RunDetailsPhaseEnum.RUNNING) {
        cardType = "jobProgress";
        // } else if (jobStatus === "FAILED" || jobStatus === "CRASHED") {
      } else if (jobStatus === RunDetailsPhaseEnum.FAILED) {
        cardType = "jobFailed";
      }
    }
  }

  return cardType;

  // if (
  //   itemType === "file" &&
  //   !!fileUploadDetails &&
  //   fileUploadDetails?.status !== "completed"
  // ) {
  //   cardType = "fileUpload";
  // }

  // if (isExtractInProgress) {
  //   cardType = "fileExtraction";
  // }

  // if (isCompressInProgress) {
  //   cardType = "fileCompression";
  // }

  // return cardType;
};
