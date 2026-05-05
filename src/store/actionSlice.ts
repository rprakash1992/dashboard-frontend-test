import type { StateCreator } from "zustand";
import { generateUniqueId } from "../utils/misc";

export const AlertMsgType = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

export type AlertMsgEnum = (typeof AlertMsgType)[keyof typeof AlertMsgType];

export interface DialogBoxMsgType {
  id: string;
  msgText: string;
  msgType: AlertMsgEnum;
  msgDuration?: number;
}

export interface UpdatedTabData {
  id: string;
  name: string;
}

const initialState = {
  profilePending: false,
  dialogBoxMsgList: [],
  showCommentBox: false,
  tabIdToDelete: "",
  reloadComponents: [],
  showBottomStickyAlert: true,
  updatedTabData: null,
};

export interface ActionsSlice {
  dialogBoxMsgList: DialogBoxMsgType[];
  showCommentBox: boolean;
  tabIdToDelete: string;
  reloadComponents: string[];
  showBottomStickyAlert: boolean;
  updatedTabData: UpdatedTabData | null;
  setDialogBoxMsg: (
    msgText: string,
    msgType: AlertMsgEnum,
    msgDuration?: number,
  ) => void;
  removeDialogBoxMsg: (index: string) => void;
  clearDialogBox: () => void;
  setShowCommentBox: (val: boolean) => void;
  setTabIdToDelete: (tabId: string) => void;
  setReloadComponent: (componentType: string[]) => void;
  addReloadComponent: (componentType: string) => void;
  removeReloadComponent: (componentType: string) => void;
  setShowBottomStickyAlert: (val: boolean) => void;
  setUpdatedTabData: (tabData: UpdatedTabData | null) => void;
}

export const createActionsSlice: StateCreator<
  ActionsSlice,
  [["zustand/devtools", never]],
  [],
  ActionsSlice
> = (set, get) => ({
  ...initialState,
  setDialogBoxMsg: (msgText, msgType, msgDuration) =>
    set((state) => {
      const id = generateUniqueId();
      return {
        ...state,
        dialogBoxMsgList: [
          ...state.dialogBoxMsgList,
          { msgText, msgType, id, msgDuration },
        ],
      };
    }),
  removeDialogBoxMsg: (index) =>
    set((state) => {
      const newList = state.dialogBoxMsgList.filter((i) => i?.id !== index);

      return {
        ...state,
        dialogBoxMsgList: newList,
      };
    }),
  clearDialogBox: () =>
    set((state) => {
      return {
        ...state,
        dialogBoxMsgList: [],
      };
    }),
  setShowCommentBox: (val: boolean) =>
    set((state) => {
      return {
        ...state,
        showCommentBox: val,
      };
    }),
  setTabIdToDelete: (tabId) =>
    set((state) => {
      return {
        ...state,
        tabIdToDelete: tabId,
      };
    }),
  setReloadComponent: (componentType) =>
    set((state) => {
      return {
        ...state,
        reloadComponent: componentType,
      };
    }),
  addReloadComponent: (componentType) => {
    const { reloadComponents } = get();
    const updatedReloadComponents = reloadComponents.includes(componentType)
      ? reloadComponents
      : [...reloadComponents, componentType];
    set({
      reloadComponents: updatedReloadComponents,
    });
  },
  removeReloadComponent: (componentType) => {
    const { reloadComponents } = get();
    const updatedReloadComponents = reloadComponents.includes(componentType)
      ? reloadComponents.filter((component) => component !== componentType)
      : reloadComponents;
    set({
      reloadComponents: updatedReloadComponents,
    });
  },
  setShowBottomStickyAlert: (val) =>
    set((state) => {
      return {
        ...state,
        showBottomStickyAlert: val,
      };
    }),
  setUpdatedTabData: (val) => {
    set({ updatedTabData: val });
  },
});
