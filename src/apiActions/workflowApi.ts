import { getWorkspaceId } from "../utils/getWorkspaceId";
import { API_SERVER_V1 } from "../config/keys";
import { CallApiNew } from "../utils/callApiNew";

export const workflowApi = {
  fetchWorkflowsByIds: async function (workflowIds: string[]) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/workflows`);
    url.searchParams.append("workflow_ids", JSON.stringify(workflowIds));

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  createWorkflow: async function (
    fileId: string,
    title: string,
    description: string,
    image: string,
    tags: string[],
    workflowVariables: Record<string, string>,
  ) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/workflows`);

    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      BODY: {
        title,
        description,
        image,
        tags,
        file_id: fileId,
        variables: workflowVariables,
      },
      HEADERS: {
        "Content-Type": "application/json",
      },
    });
  },
};
