import { CallApiNew } from "../utils/callApiNew";
import { API_SERVER_V1 } from "../config/keys";

export const tagsApi = {
  fetchTags: async function (ac?: AbortController) {
    return await CallApiNew({
      URL: `${API_SERVER_V1}/tags`,
      METHOD: "GET",
      SIGNAL: ac?.signal,
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
};
