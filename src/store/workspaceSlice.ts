import type { StateCreator } from "zustand";
import type { ItemMetadataType } from "../types";

const initialState = {
  selectedWorkspace: {} as ItemMetadataType,
  myWorkspaces: [],
};

export interface WorkspacesSlice {
  selectedWorkspace: ItemMetadataType;
  myWorkspaces: ItemMetadataType[];
  setSelectedWorkspace: (val: ItemMetadataType) => void;
  setMyWorkspaces: (val: ItemMetadataType[]) => void;
}

export const createWorkspacesSlice: StateCreator<
  WorkspacesSlice,
  [["zustand/devtools", never]],
  [],
  WorkspacesSlice
> = (set) => ({
  ...initialState,
  setSelectedWorkspace: (val) =>
    set((state) => {
      return {
        ...state,
        selectedWorkspace: val,
      };
    }),
  setMyWorkspaces: (val) =>
    set((state) => {
      return {
        ...state,
        myWorkspaces: val,
      };
    }),
});
