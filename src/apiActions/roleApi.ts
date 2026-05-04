import { CallApiNew } from "../utils/callApiNew";
import { API_SERVER_V1 } from "../config/keys";

export const roleApi = {
  getRolePermissions: async function (roleId: string) {
    const url = new URL(`${API_SERVER_V1}/roles/${roleId}/permissions`);

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
};
