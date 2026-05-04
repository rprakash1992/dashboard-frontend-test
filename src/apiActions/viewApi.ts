import { CallApiNew } from "../utils/callApiNew";
import { API_SERVER_V1 } from "../config/keys";

export const viewApi = {
  getDashboardViews: async function () {
    const url = new URL(`${API_SERVER_V1}/views`);

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
    });
  },
  insertNewView: async function (newView: any) {
    return await CallApiNew({
      URL: `${API_SERVER_V1}/views`,
      METHOD: "POST",
      BODY: newView,
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  deleteViewById: async function (viewId: any) {
    return await CallApiNew({
      URL: `${API_SERVER_V1}/views/${viewId}`,
      METHOD: "DELETE",
    });
  },
  updateViewById: async function (
    viewId: string,
    fieldName: string,
    fieldValue: any,
  ) {
    return await CallApiNew({
      URL: `${API_SERVER_V1}/views/${viewId}`,
      METHOD: "PATCH",
      BODY: {
        field_name: fieldName,
        field_value: fieldValue,
      },
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  updateFullView: async function (view: any, ac?: AbortController) {
    const url = new URL(`${API_SERVER_V1}/views/${view?.id}`);

    // url.searchParams.append("all_fields", JSON.stringify(true));

    return await CallApiNew({
      URL: url,
      METHOD: "PUT",
      SIGNAL: ac?.signal,
      BODY: view,
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
};
