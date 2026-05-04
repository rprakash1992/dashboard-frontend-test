import { CallApiNew } from "../utils/callApiNew";
import { getWorkspaceId } from "../utils/getWorkspaceId";
import { API_SERVER_V1 } from "../config/keys";

export const fileApi = {
  extractFile: async function (fileId: string) {
    const workspaceId = getWorkspaceId();

    const url = new URL(
      `${API_SERVER_V1}/${workspaceId}/files/${fileId}/extract`,
    );

    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  compressFile: async function (fileId: string) {
    const workspaceId = getWorkspaceId();

    const url = new URL(
      `${API_SERVER_V1}/${workspaceId}/files/${fileId}/compress`,
    );

    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  fetchFilesByIds: async function (fileIds: string[], ac?: AbortController) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/files`);
    url.searchParams.append("file_ids", JSON.stringify(fileIds));

    return await CallApiNew({
      URL: url,
      METHOD: "GET",
      SIGNAL: ac?.signal,
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  copyItemToAnotherFolder: async function (
    itemId: string,
    itemIdTo: string,
    ac?: AbortController,
  ) {
    const workspaceId = getWorkspaceId();

    const url = new URL(
      `${API_SERVER_V1}/${workspaceId}/files/${itemId}/copy/${itemIdTo}`,
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
  downloadFile: async function (itemId: string, ac?: AbortController) {
    const workspaceId = getWorkspaceId();

    const url = new URL(
      `${API_SERVER_V1}/${workspaceId}/files/${itemId}/download`,
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
  insertFile: async function (
    title: string,
    description: string,
    image: string,
    tags: string[],
    fileExtension: string,
  ) {
    const workspaceId = getWorkspaceId();
    const url = new URL(`${API_SERVER_V1}/${workspaceId}/files`);

    return await CallApiNew({
      URL: url,
      METHOD: "POST",
      BODY: {
        title,
        description,
        image,
        tags,
        file_extension: fileExtension,
      },
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
  updateFileField: async function (
    fileId: string,
    fieldName: string,
    fieldValue: any,
    ac?: AbortController,
  ) {
    const workspaceId = getWorkspaceId();

    const url = new URL(`${API_SERVER_V1}/${workspaceId}/files/${fileId}`);

    return await CallApiNew({
      URL: url,
      METHOD: "PATCH",
      SIGNAL: ac?.signal,
      BODY: {
        field_name: fieldName,
        field_value: fieldValue,
      },
      HEADERS: {
        "content-type": "application/json",
      },
    });
  },
};
