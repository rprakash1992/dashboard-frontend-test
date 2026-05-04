import type { StateCreator } from "zustand";

// export type FileUploadStatus = "completed" | "failed" | "progress";
export const FileUploadStatusEnum = {
  COMPLETED: "completed",
  FAILED: "failed",
  PROGRESS: "progress",
};

export type FileUploadStatus =
  (typeof FileUploadStatusEnum)[keyof typeof FileUploadStatusEnum];

export interface FileUploadDetail {
  itemId: string;
  title: string;
  status: FileUploadStatus;
  isCalculatingEstimatedTime: boolean;
  totalParts: number;
  uploadedParts: number;
  estimatedTime: number;
}

export interface FileUploadDetails {
  [key: string]: FileUploadDetail;
}

const initialState = {
  fileUploads: {},
};

export interface FileSlice {
  fileUploads: FileUploadDetails;
  setFileUploads: (fileUploads: FileUploadDetails) => void;
  addUpdateFileUpload: (key: string, val: FileUploadDetail) => void;
}

export const createFileSlice: StateCreator<
  FileSlice,
  [["zustand/devtools", never]],
  [],
  FileSlice
> = (set) => ({
  ...initialState,
  setFileUploads: (fileUploads) =>
    set((state) => {
      return {
        ...state,
        fileUploads,
      };
    }),
  addUpdateFileUpload: (key, val) =>
    set((state) => {
      return {
        ...state,
        fileUploads: {
          ...state.fileUploads,
          [key]: val,
        },
      };
    }),
});
