import type { StateCreator } from "zustand";

export interface TagType {
  name: string;
  description: string | null;
}

const initialState = {
  tags: [],
};

export interface TagsSlice {
  tags: TagType[];
  setTags: (obj: any) => void;
  updateTags: (val: TagType) => void;
}

export const createTagsSlice: StateCreator<
  TagsSlice,
  [["zustand/devtools", never]],
  [],
  TagsSlice
> = (set) => ({
  ...initialState,
  setTags: (newItems: []) =>
    set((state) => {
      return {
        ...state,
        tags: newItems,
      };
    }),
  updateTags: (val) =>
    set((state) => {
      if (
        state.tags.find(
          (tag) => tag.name.toLowerCase() === val.name.toLowerCase(),
        )
      ) {
        return state;
      }

      return {
        ...state,
        tags: [...state.tags, val],
      };
    }),
});
