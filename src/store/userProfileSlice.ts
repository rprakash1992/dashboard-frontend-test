import type { StateCreator } from "zustand";

export interface UserProfileType {
  id: string;
  name: string;
  email: string;
  dob: string;
  picture: string;
  gender: string;
  phone: number | string;
  country: string;
  status: string;
}

export interface CountryType {
  label: string;
  value: string;
  code: string;
}

const initialState = {
  userProfile: {} as UserProfileType,
  profilePending: false,
};

export interface UserSlice {
  userProfile: UserProfileType;
  profilePending: boolean;
  setUserProfile: (profile: UserProfileType) => void;
  setProfilePending: (val: boolean) => void;
}

export const createUserSlice: StateCreator<
  UserSlice,
  [["zustand/devtools", never]],
  [],
  UserSlice
> = (set) => ({
  ...initialState,
  setUserProfile: (profile) =>
    set((state) => {
      return {
        ...state,
        userProfile: profile,
      };
    }),
  setProfilePending: (val) =>
    set((state) => {
      return {
        ...state,
        profilePending: val,
      };
    }),
});
