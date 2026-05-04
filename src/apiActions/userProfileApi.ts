import { CallApiNew } from "../utils/callApiNew";
import { API_SERVER_V1 } from "../config/keys";
import { getWorkspaceId } from "../utils/getWorkspaceId";

export const userProfileApi = {
  getUserProfile: async function (userId: string) {
    const workspaceId = getWorkspaceId();
    const url = new URL(
      `${API_SERVER_V1}/${workspaceId}/user-profiles/${userId}`,
    );

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  getUserProfiles: async function (userIds: string[]) {
    const workspaceId = getWorkspaceId();
    const url = new URL(`${API_SERVER_V1}/${workspaceId}/user-profiles`);
    userIds.forEach((id) => url.searchParams.append("user_ids", id));

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  updateUserProfile: async function (
    profileId: string,
    fieldName: string,
    fieldVal: any,
  ) {
    const workspaceId = getWorkspaceId();
    const url = new URL(
      `${API_SERVER_V1}/${workspaceId}/user-profiles/${profileId}`,
    );

    return await CallApiNew({
      URL: url,
      METHOD: "PATCH",
      BODY: {
        field_name: fieldName,
        field_value: fieldVal,
      },
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  updateFullUserProfile: async function (fullProfile: any) {
    const workspaceId = getWorkspaceId();
    const url = new URL(`${API_SERVER_V1}/${workspaceId}/user-profiles`);

    return await CallApiNew({
      URL: url,
      METHOD: "PUT",
      BODY: fullProfile,
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  searchUserProfiles: async function (searchText: string) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/user-profiles/search`);

    url.searchParams.append("search_text", searchText);

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
};
