import { CallApiNew } from "../utils/callApiNew";
import { API_SERVER_V1 } from "../config/keys";

export const modelSchemaApi = {
  fetchAllModelSchemas: async function (ac?: AbortController) {
    return await CallApiNew({
      URL: `${API_SERVER_V1}/project-schemas`,
      METHOD: "GET",
      SIGNAL: ac?.signal,
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  insertModelSchemas: async function (data: any[], ac?: AbortController) {
    return await CallApiNew({
      URL: `${API_SERVER_V1}/model-schemas/insert-model-schemas`,
      METHOD: "POST",
      SIGNAL: ac?.signal,
      BODY: data,
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
};
