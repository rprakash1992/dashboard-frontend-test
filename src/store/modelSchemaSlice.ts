import type { StateCreator } from "zustand";

export interface ModelSchemasType {
  title: string;
  schema: any;
  ui_schema?: any;
  data?: any;
}

const initialState = {
  modelSchemas: [],
};

export interface ModelSchemasSlice {
  modelSchemas: ModelSchemasType[];
  setModelSchemas: (schemas: ModelSchemasType[]) => void;
}

export const createModelSchemasSlice: StateCreator<
  ModelSchemasSlice,
  [["zustand/devtools", never]],
  [],
  ModelSchemasSlice
> = (set) => ({
  ...initialState,
  setModelSchemas: (schemas) =>
    set((state) => {
      return {
        ...state,
        modelSchemas: schemas,
      };
    }),
});
