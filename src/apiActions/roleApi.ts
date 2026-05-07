import { CallApiNew } from "../utils/callApiNew";
import { API_SERVER_V1 } from "../config/keys";
import { getWorkspaceId } from "../utils/getWorkspaceId";
import type { RolePermission } from "../components/NewRole/RolePermissions";

export const roleApi = {
  getRolePermissions: async function (roleId: string) {
    const workspaceId = getWorkspaceId();

    const url = new URL(
      `${API_SERVER_V1}/${workspaceId}/roles/${roleId}/permissions`,
    );

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  insertRole: async function (
    title: string,
    description: string,
    image: string,
    tags: string[],
    permissions: RolePermission[],
  ) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/roles`);

    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      HEADERS: {
        "content-type": "application/json",
      },
      BODY: {
        title,
        description,
        image,
        tags,
        permissions,
      },
    });
  },
};
