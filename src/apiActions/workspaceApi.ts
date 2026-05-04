import { getWorkspaceId } from "../utils/getWorkspaceId";
import { API_SERVER_V1 } from "../config/keys";
import { CallApiNew } from "../utils/callApiNew";

export const workspaceApi = {
  fetchMyWorkspaces: async function (ac?: AbortController) {
    return await CallApiNew({
      URL: `${API_SERVER_V1}/workspaces/my`,
      METHOD: "GET",
      SIGNAL: ac?.signal,
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  insertWorkspace: async function (
    title: string,
    description: string,
    image: string,
    tags: string[],
  ) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/workspaces`);

    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      BODY: {
        title,
        description,
        image,
        tags,
      },
      HEADERS: {
        "Content-Type": "application/json",
      },
    });
  },
  addUserToWorkspace: async function (workspaceId: string, userId: string, roleId: string) {
    const selectedWorkspaceId = getWorkspaceId();
    const url = new URL(`${API_SERVER_V1}/${selectedWorkspaceId}/workspaces/new-user`);

    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      BODY: {
        user_id: userId,
        role_id: roleId,
        workspace_id: workspaceId,
      },
      HEADERS: {
        "Content-Type": "application/json",
      },
    });
  },
  addItemToWorkspace: async function (workspaceId: string, itemId: string) {
    const selectedWorkspaceId = getWorkspaceId();
    const url = new URL(
      `${API_SERVER_V1}/${selectedWorkspaceId}/workspaces/new-item`,
    );

    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      BODY: {
        workspace_id: workspaceId,
        item_id: itemId,
      },
      HEADERS: {
        "Content-Type": "application/json",
      },
    });
  },
  fetchWorkspaceUsers: async function (workspaceId: string) {
    const selectedWorkspaceId = getWorkspaceId();
    const url = new URL(
      `${API_SERVER_V1}/${selectedWorkspaceId}/workspaces/users`,
    );

    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      BODY: {
        workspace_id: workspaceId,
      },
      HEADERS: {
        "Content-Type": "application/json",
      },
    });
  },
};
