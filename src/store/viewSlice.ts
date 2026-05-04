import type { StateCreator } from "zustand";

export interface NewFilterItem {
  filterTitle: string;
  operator: string;
  value: any;
  isChecked: boolean;
}

export interface FilterItem {
  id: string;
  filterTitle: string;
  operator: string;
  value: any;
  isChecked: boolean;
}

export interface GroupFilterItem {
  id: string;
  filterTitle: string;
  operator: string;
  children: FilterItem[];
  isChecked: boolean;
  groupOperator: string;
}

export interface ViewItemPropertyType {
  id: string;
  title: string;
  owner?: string;
  item_type: string;
  view_as: string;
  group_by: string;
  filters: {
    filterType: FilterItem[];
    groupedFilterType: GroupFilterItem[];
  };
  sort_by: string;
  status: string;
}

type ViewActivityContentType = {
  text: string;
  contentType: string;
  time: string;
};

export type ViewActivityType = {
  id: string;
  prev_action?: string;
  content: ViewActivityContentType;
  view_id: number;
};

const initialState = {
  viewProperties: [],
  isCopyingView: false,
  isDeletingView: false,
  viewsAddingInProgress: [],
};

export interface ViewPropertiesSlice {
  viewProperties: ViewItemPropertyType[];
  isCopyingView: boolean;
  isDeletingView: boolean;
  viewsAddingInProgress: ViewItemPropertyType[];
  setViewPropertiesItem: (obj: any) => void;
  updateViewProperties: (view: ViewItemPropertyType) => void;
  setIsCopyingView: (val: boolean) => void;
  setIsDeletingView: (val: boolean) => void;
  setViewsAddingInProgress: (val: ViewItemPropertyType[]) => void;
}

export const createViewPropertiesSlice: StateCreator<
  ViewPropertiesSlice,
  [["zustand/devtools", never]],
  [],
  ViewPropertiesSlice
> = (set, get) => ({
  ...initialState,
  setViewPropertiesItem: (newItems: []) =>
    set((state) => {
      return {
        ...state,
        viewProperties: newItems,
      };
    }),
  updateViewProperties: (updatedView) => {
    const { viewProperties } = get();

    const newViewProperties = viewProperties.map((view) =>
      String(view.id) === String(updatedView.id) ? updatedView : view,
    );

    set((state) => {
      return {
        ...state,
        viewProperties: newViewProperties,
      };
    });
  },
  setIsCopyingView: (val) => {
    set({ isCopyingView: val });
  },
  setIsDeletingView: (val) => {
    set({ isDeletingView: val });
  },
  setViewsAddingInProgress: (val) => {
    set({ viewsAddingInProgress: val });
  },
});
