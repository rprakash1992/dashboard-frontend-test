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
  isDownloadingItem: null,
  isDeletingItem: null,
  isOpeningItem: null,
};

export interface ItemSlice {
  isDownloadingItem: string | null;
  isDeletingItem: string | null;
  isOpeningItem: string | null;
  setIsDownloadingItem: (val: string | null) => void;
  setIsDeletingItem: (val: string | null) => void;
  setIsOpeningItem: (val: string | null) => void;
}

export const createItemSlice: StateCreator<
  ItemSlice,
  [["zustand/devtools", never]],
  [],
  ItemSlice
> = (set) => ({
  ...initialState,
  setIsDownloadingItem: (val) => {
    set({ isDownloadingItem: val });
  },
  setIsDeletingItem: (val) => {
    set({ isDeletingItem: val });
  },
  setIsOpeningItem: (val) => {
    set({ isOpeningItem: val });
  },
});
