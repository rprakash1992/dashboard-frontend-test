import type { StateCreator } from "zustand";
import type { ItemMetadataType } from "../types";

export interface UserRoleType {
  id: string;
  name: string;
  description: string | null;
  permissions: any;
}

const initialState = {
  allRoles: [],
};

export interface UserRolesSlice {
  allRoles: ItemMetadataType[];
  setAllRoles: (roles: ItemMetadataType[]) => void;
}

export const createUserRolesSlice: StateCreator<
  UserRolesSlice,
  [["zustand/devtools", never]],
  [],
  UserRolesSlice
> = (set) => ({
  ...initialState,
  setAllRoles: (roles) =>
    set((state) => {
      return {
        ...state,
        allRoles: roles,
      };
    }),
});
