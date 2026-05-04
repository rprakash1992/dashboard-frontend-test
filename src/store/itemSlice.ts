import type { StateCreator } from "zustand";
import type { ItemMetadataType } from "../types";

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
  updatedItemMetadata: null,
  newItemMetadata: null,
  removeItemMetadata: null,
};

export interface ItemSlice {
  isDownloadingItem: string | null;
  isDeletingItem: string | null;
  isOpeningItem: string | null;
  updatedItemMetadata: ItemMetadataType | null;
  newItemMetadata: ItemMetadataType | null;
  removeItemMetadata: ItemMetadataType | null;
  setIsDownloadingItem: (val: string | null) => void;
  setIsDeletingItem: (val: string | null) => void;
  setIsOpeningItem: (val: string | null) => void;
  setUpdatedItemMetadata: (val: ItemMetadataType | null) => void;
  setNewItemMetadata: (val: ItemMetadataType | null) => void;
  setRemoveItemMetadata: (val: ItemMetadataType | null) => void;
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
  setUpdatedItemMetadata: (val) => {
    set({ updatedItemMetadata: val });
  },
  setNewItemMetadata: (val) => {
    set({ newItemMetadata: val });
  },
  setRemoveItemMetadata: (val) => {
    set({ removeItemMetadata: val });
  },
});
