import { CallApiNew } from "../utils/callApiNew";
import { API_SERVER_V1 } from "../config/keys";

export const storageApi = {
  getImageUploadUrl: async function (
    // folderName: string,
    fileKey: string,
    contentType: string,
    ac?: AbortController,
  ) {
    return await CallApiNew({
      URL: `${API_SERVER_V1}/file-upload/get-image-upload-url`,
      METHOD: "POST",
      SIGNAL: ac?.signal,
      BODY: {
        // folderName,
        fileKey,
        contentType,
      },
    });
  },

  getImageDownloadUrl: async function (
    fileKey: string,
    ac?: AbortController,
  ) {
    return await CallApiNew({
      URL: `${API_SERVER_V1}/file-upload/get-image-download-url`,
      METHOD: "POST",
      SIGNAL: ac?.signal,
      BODY: { fileKey },
    });
  },

  getImageDownloadUrls: async function (
    fileKeys: string[],
    ac?: AbortController,
  ) {
    return await CallApiNew({
      URL: `${API_SERVER_V1}/file-upload/get-image-download-urls`,
      METHOD: "POST",
      SIGNAL: ac?.signal,
      BODY: { fileKeys },
    });
  },
};
