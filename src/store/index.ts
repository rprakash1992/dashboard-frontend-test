import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type UserSlice, createUserSlice } from "./userProfileSlice";
import {
  type ViewPropertiesSlice,
  createViewPropertiesSlice,
} from "./viewSlice";
import { type TagsSlice, createTagsSlice } from "./tagSlice";
import { type ActionsSlice, createActionsSlice } from "./actionSlice";
import { type UserRolesSlice, createUserRolesSlice } from "./userRoleSlice";
import {
  type ModelSchemasSlice,
  createModelSchemasSlice,
} from "./modelSchemaSlice";
import { type WorkspacesSlice, createWorkspacesSlice } from "./workspaceSlice";
import { type FileSlice, createFileSlice } from "./fileSlice";
import { type ItemSlice, createItemSlice } from "./itemSlice";

export const useStore = create<
  UserSlice &
    ViewPropertiesSlice &
    TagsSlice &
    ActionsSlice &
    UserRolesSlice &
    ModelSchemasSlice &
    WorkspacesSlice &
    FileSlice &
    ItemSlice
>()(
  devtools((...a) => ({
    ...createUserSlice(...a),
    ...createViewPropertiesSlice(...a),
    ...createTagsSlice(...a),
    ...createActionsSlice(...a),
    ...createUserRolesSlice(...a),
    ...createModelSchemasSlice(...a),
    ...createWorkspacesSlice(...a),
    ...createFileSlice(...a),
    ...createItemSlice(...a),
  })),
);
