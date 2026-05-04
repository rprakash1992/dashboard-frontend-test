import SparkMD5 from "spark-md5";
import { fileApi } from "../apiActions/fileApi";
import { API_SERVER_V1 } from "../config/keys";
import { useStore } from "../store";

const FILE_UPLOAD_ENDPOINT_URL = `${API_SERVER_V1}/file-upload`;

type PartType = {
  id: number;
  checksum: string | null;
  length: number;
  pos: number;
  status: string;
  upload: {
    url: string;
    response?: any;
  };
};

export function useMultipartUpload() {
  const fileUploads = useStore((state) => state.fileUploads);
  const addUpdateFileUpload = useStore((state) => state.addUpdateFileUpload);

  const getEstimatedTime = (batchUploadTimeData: any, parts: PartType[]) => {
    const notUploadedChunks = parts.filter(
      (part) => part?.status === "upload_pending",
    );
    const batchIds = Object.keys(batchUploadTimeData);
    const batchTimes: number[] = Object.values(batchUploadTimeData);
    const batchParts = parts.filter((part) =>
      batchIds?.includes(String(part?.id)),
    );
    const batchSize = batchParts.reduce((acc, curr) => acc + curr?.length, 0);
    const totalBatchTime = batchTimes.reduce((acc, curr) => acc + curr, 0);
    const avgBatchTime = totalBatchTime / batchIds?.length;

    const notUploadedChunksSize = notUploadedChunks.reduce(
      (acc, curr) => acc + curr?.length,
      0,
    );
    const estTimeRemaining = (avgBatchTime * notUploadedChunksSize) / batchSize;

    return estTimeRemaining;
  };

  const getFileHash = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const CHUNK_SIZE = 1024 * 1024;
      let finalHash = "";
      if (file) {
        const spark = new SparkMD5.ArrayBuffer();
        let currentChunk = 0;
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        const processChunk = () => {
          const start = currentChunk * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const blob = file.slice(start, end);

          const reader = new FileReader();
          reader.onload = (e) => {
            spark.append(e?.target?.result as ArrayBuffer); // Append chunk to the hash
            currentChunk++;

            if (currentChunk < totalChunks) {
              processChunk(); // Process the next chunk
            } else {
              finalHash = spark.end(); // Get the final hash
              resolve(finalHash);
            }
          };
          reader.onerror = () => {
            reject("Error: error getting hash.");
          };
          reader.readAsArrayBuffer(blob);
        };

        processChunk(); // Start processing the first chunk
      } else {
        reject("Error: no file found");
      }
    });
  };

  const uploadChunk = (chunk: Blob, url: string) => {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        body: chunk,
      })
        .then((resp) => {
          if (resp?.status === 200) {
            const headers = resp.headers;
            let etag = "";
            let contentLength = "";

            Array.from(headers.entries()).forEach(([key, value]) => {
              if (key === "etag") {
                etag = value;
              }
              if (key === "content-length") {
                contentLength = value;
              }
            });

            resolve({ etag, contentLength });
          } else if (resp?.status === 403) {
            reject({ errorCode: 403, error: resp?.statusText });
          } else {
            reject({ errorCode: 500, error: resp?.statusText });
          }
        })
        .catch(() => {
          reject({ errorCode: 500, error: "Error while uploading chunk" });
        });
    });
  };

  const getPromise = (part: PartType, file: File) => {
    const url = part?.upload?.url;
    const start = part?.pos;
    const end = part?.pos + part?.length;
    const chunk = file?.slice(start, end);
    const partId = part?.id;

    return new Promise((resolve, reject) => {
      const uploadChunkPromise = uploadChunk(chunk, url);
      const computeChecksumPromise = getFileHash(chunk);

      Promise.all([uploadChunkPromise, computeChecksumPromise])
        .then((resp) => {
          // setUploadedParts();
          resolve({ id: partId, resp });
        })
        .catch((err) => {
          reject({ id: partId, resp: err });
        });
    });
  };

  const initiateFileUpload = async (file: File, fileS3Url: string) => {
    const initiateFileUploadPayload = {
      file: {
        // id: uniqueId,
        name: file?.name,
        size: file?.size,
        lastModified: file?.lastModified,
      },
      file_s3_url: fileS3Url,
    };

    const resp = await fetch(
      `${FILE_UPLOAD_ENDPOINT_URL}/initiate-file-upload`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(initiateFileUploadPayload),
      },
    );

    const initiateFileUploadResponse = await resp.json();

    const {
      file: fileDetails,
      status,
      // checksum,
    } = initiateFileUploadResponse;

    if (status?.success) {
      const { id } = fileDetails;
      return id;
    } else {
      return null;
    }
  };

  const updateFilePartsUrl = async (id: string) => {
    const updateFilePartUrlsPayload = { file: { id } };

    const resp = await fetch(
      `${FILE_UPLOAD_ENDPOINT_URL}/update-file-part-urls`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(updateFilePartUrlsPayload),
      },
    );

    const updateFilePartUrlsResponse = await resp.json();

    const { status, parts } = updateFilePartUrlsResponse;

    if (status?.success) {
      return parts;
    } else {
      return null;
    }
  };

  const updateFilePartsStatus = async (
    id: string,
    parts: PartType[],
    estimatedTime: number,
  ) => {
    const updateFilePartsStatusPayload = {
      id,
      parts,
      estimatedTime,
    };

    const resp = await fetch(
      `${FILE_UPLOAD_ENDPOINT_URL}/update-file-parts-status`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(updateFilePartsStatusPayload),
      },
    );

    const updateFilePartsStatusResponse = await resp.json();

    const {
      parts: returnedParts,
      upload_complete,
      // status,
    } = updateFilePartsStatusResponse;

    return { upload_complete, returnedParts };
  };

  const getUrlExpiry = (url: string) => {
    const indexOfLastEquals = url.lastIndexOf("=");
    const expiry = url?.slice(indexOfLastEquals + 1);
    return expiry;
  };

  const setUploadStatusInFileSource = async (
    metadataId: string,
    // fileKey: string,
    isUploaded: boolean,
  ) => {
    const response = await fileApi.updateFileField(
      metadataId,
      "is_uploaded",
      isUploaded,
      // fileKey,
    );

    return response;
  };

  async function multipartUpload(
    file: File,
    metadataId: string,
    fileS3Url: string,
  ) {
    try {
      const id = await initiateFileUpload(file, fileS3Url);
      const { error } = await setUploadStatusInFileSource(metadataId, false);
      const fileUploadDetails = fileUploads[id];

      if (id && !error) {
        const parts = await updateFilePartsUrl(id);

        const maxNumOfParallelUploads = 4;
        if (parts) {
          let myParts: PartType[] = JSON.parse(JSON.stringify(parts));

          if (myParts.every((part) => part?.status === "upload_verified")) {
            // const { upload_complete, returnedParts } =
            await updateFilePartsStatus(id, myParts, 0);
            addUpdateFileUpload(metadataId, {
              ...fileUploadDetails,
              status: "completed",
              isCalculatingEstimatedTime: false,
              estimatedTime: 0,
              totalParts: myParts.length,
              uploadedParts: myParts.length,
            });
            return;
          }

          let endLoop = false;

          while (
            myParts?.filter(
              (part: PartType) => part?.status === "upload_pending",
            )?.length > 0
          ) {
            const partsWithUploadPending = myParts?.filter(
              (part: PartType) => part?.status === "upload_pending",
            );

            const numPartsWithUploadPending = partsWithUploadPending.length;

            const numberOfParallelUploads = Math.min(
              numPartsWithUploadPending,
              maxNumOfParallelUploads,
            );

            const partsToUpload = partsWithUploadPending?.slice(
              0,
              numberOfParallelUploads,
            );

            const url = partsToUpload[0].upload?.url;
            const urlsExpiry = Number(getUrlExpiry(url)) * 1000;
            const currentTime = new Date().getTime();

            if (urlsExpiry > currentTime) {
              // urls not expired
              const uploadPromises: any[] = [];
              const partIds: any[] = [];

              partsToUpload.forEach((part: PartType) => {
                const newPromise = getPromise(part, file);
                uploadPromises.push(newPromise);
                partIds.push(part?.id);
              });

              const startTime = performance.now();
              const promisesResp = await Promise.allSettled(uploadPromises);

              const batchUploadTimeData: any = {};
              promisesResp.forEach((response) => {
                if (response?.status === "fulfilled") {
                  const { id, resp } = response?.value;
                  const [chunkUploadResponse, checksum] = resp;
                  const { etag, contentLength } = chunkUploadResponse;

                  const index = myParts.findIndex(
                    (part: PartType) => part?.id === id,
                  );

                  myParts[index] = {
                    ...myParts[index],
                    status: "upload_performed",
                    checksum,
                    upload: {
                      ...myParts[index].upload,
                      response: {
                        etag,
                        "content-length": contentLength,
                      },
                    },
                  };

                  const endTime = performance.now();
                  const difference = endTime - startTime;

                  batchUploadTimeData[id] = difference;
                } else {
                  endLoop = true;
                }
              });

              const estimatedTime = getEstimatedTime(
                batchUploadTimeData,
                myParts,
              );

              if (endLoop) {
                break;
              }
              const uploadedParts =
                myParts.length - partsWithUploadPending.length;
              addUpdateFileUpload(metadataId, {
                ...fileUploadDetails,
                status: "progress",
                isCalculatingEstimatedTime: false,
                estimatedTime: estimatedTime,
                totalParts: myParts.length,
                uploadedParts: uploadedParts,
              });
              const {
                upload_complete,
                // returnedParts
              } = await updateFilePartsStatus(id, myParts, estimatedTime);

              if (upload_complete) {
                await setUploadStatusInFileSource(
                  metadataId,
                  // id,
                  true,
                );
                addUpdateFileUpload(metadataId, {
                  ...fileUploadDetails,
                  status: "completed",
                  isCalculatingEstimatedTime: false,
                  estimatedTime: 0,
                  totalParts: myParts.length,
                  uploadedParts: myParts.length,
                });
              }
            } else {
              // urls expired
              const parts = await updateFilePartsUrl(id);

              if (parts) {
                myParts = JSON.parse(JSON.stringify(parts));
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  return multipartUpload;
}
