import { CallApiNew } from "../utils/callApiNew";
import { getWorkspaceId } from "../utils/getWorkspaceId";
import { API_SERVER_V1 } from "../config/keys";

export const jobApi = {
  fetchJobsByOutputItemsIds: async function (
    itemIds: string[],
    ac?: AbortController,
  ) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/jobs/output-items`);
    url.searchParams.append("output_items_ids", JSON.stringify(itemIds));

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      SIGNAL: ac?.signal,
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  runWorkflow: async function (
    title: string,
    description: string,
    image: string,
    tags: string[],
    workflowId: string,
    jobParameters: Record<string, any>,
    ac?: AbortController,
  ) {
    const workspaceId = getWorkspaceId();
    const url = new URL(`${API_SERVER_V1}/${workspaceId}/jobs`);

    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      BODY: {
        title,
        description,
        image,
        tags,
        workflow_id: workflowId,
        job_parameters: jobParameters,
      },
      HEADERS: {
        "Content-Type": "application/json",
      },
      SIGNAL: ac?.signal,
    });
  },
  fetchJobsByIds: async function (jobIds: string[], ac?: AbortController) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/jobs`);
    url.searchParams.append("job_ids", JSON.stringify(jobIds));

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      SIGNAL: ac?.signal,
    });
  },
};
