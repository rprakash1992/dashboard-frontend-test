import { CallApiNew } from "../utils/callApiNew";
import { getWorkspaceId } from "../utils/getWorkspaceId";
import { API_SERVER_V1 } from "../config/keys";

export const reportApi = {
  insertReport: async function (
    title: string,
    description: string,
    image: string,
    tags: string[],
    projectId: string,
    template: string,
  ) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/reports`);

    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      BODY: {
        title,
        description,
        image,
        tags,
        project: projectId,
        template,
      },
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  fetchReportByIds: async function (reportIds: string[], ac?: AbortController) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/reports`);
    url.searchParams.append("report_ids", JSON.stringify(reportIds));

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      SIGNAL: ac?.signal,
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
};
