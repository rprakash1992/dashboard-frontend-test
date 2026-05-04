import { CallApiNew } from "../utils/callApiNew";
import { getWorkspaceId } from "../utils/getWorkspaceId";
import { API_SERVER_V1 } from "../config/keys";
import type { ItemMetadataType } from "../types";

export const itemApi = {
  fetchDashboardItems: async function (itemType: string) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/items/${itemType}`);

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  searchItems: async function (itemType: string, searchText: string) {
    const workspaceId = getWorkspaceId();

    const url = new URL(
      `${API_SERVER_V1}/${workspaceId}/items/${itemType}/search`,
    );
    url.searchParams.append("search_text", searchText);

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  getItemByIds: async function (itemIds: string[], ac?: AbortController) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/items`);
    url.searchParams.append("item_ids", JSON.stringify(itemIds));
    // url.searchParams.append("include_all", JSON.stringify(true));

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      SIGNAL: ac?.signal,
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  updateFullItem: async function (
    item: ItemMetadataType,
    ac?: AbortController,
  ) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/items/item`);

    return await CallApiNew({
      URL: url,
      METHOD: "PUT",
      SIGNAL: ac?.signal,
      HEADERS: {
        "content-type": "application/json",
      },
      BODY: item,
    });
  },
  updateItemMetadata: async function (
    itemId: string,
    itemType: string,
    fieldName: string,
    fieldValue: string | string[] | null,
  ) {
    const workspaceId = getWorkspaceId();

    const url = new URL(
      `${API_SERVER_V1}/${workspaceId}/items/${itemType}/${itemId}`,
    );

    return await CallApiNew({
      URL: url,
      METHOD: "PATCH",
      HEADERS: {
        "content-type": "application/json",
      },
      BODY: {
        field_name: fieldName,
        field_value: fieldValue,
      },
    });
  },
  deleteItemById: async function (
    itemId: string,
    itemType: string,
    ac?: AbortController,
  ) {
    const workspaceId = getWorkspaceId();

    const url = new URL(
      `${API_SERVER_V1}/${workspaceId}/items/${itemType}/${itemId}`,
    );
    // url.searchParams.append("include_all", JSON.stringify(true));

    return await CallApiNew({
      URL: url,
      METHOD: "DELETE",
      SIGNAL: ac?.signal,
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  fetchItemActivities: async function (
    itemId: string,
    itemType: string,
    ac?: AbortController,
  ) {
    const workspaceId = getWorkspaceId();

    const url = new URL(
      `${API_SERVER_V1}/${workspaceId}/item-activities/${itemType}/${itemId}`,
    );

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      SIGNAL: ac?.signal,
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  getItemTraceability: async function (itemId: string, ac?: AbortController) {
    const workspaceId = getWorkspaceId();

    const url = new URL(
      `${API_SERVER_V1}/${workspaceId}/items/${itemId}/traceability`,
    );

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
