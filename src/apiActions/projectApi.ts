import { CallApiNew } from "../utils/callApiNew";
import { getWorkspaceId } from "../utils/getWorkspaceId";
import { API_SERVER_V1 } from "../config/keys";

export const projectApi = {
  insertProject: async function (
    title: string,
    description: string,
    image: string,
    tags: string[],
    file: string,
    fileParameters: Record<string, any>,
    ac?: AbortController,
  ) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/projects`);

    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      SIGNAL: ac?.signal,
      BODY: {
        title,
        description,
        image,
        tags,
        file,
        file_parameters: fileParameters,
      },
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  fetchProjectByIds: async function (
    projectIds: string[],
    ac?: AbortController,
  ) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/projects`);
    url.searchParams.append("project_ids", JSON.stringify(projectIds));

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      HEADERS: {
        "content-type": "application/json",
      },
      SIGNAL: ac?.signal,
    });
  },
};
