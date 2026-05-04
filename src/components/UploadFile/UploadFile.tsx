import { Box, Text, useMantineColorScheme } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import SparkMD5 from "spark-md5";
// import { ZipReader, BlobReader } from "@zip.js/zip.js";

import { useCustomColors } from "../../customHooks/useCustomColors";
import { SelectedFileInfo } from "./SelectedFileInfo";
import { UploadingProcess } from "./UploadingProcess";
// import { useStore } from "../../store";
import { API_SERVER_URL } from "../../config/keys";
import { VCUploadIcon, VCCloseIcon } from "../../assets/icons";
import { useState } from "react";

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

type UploadFileProps = {
  setFileTitle: (fileName: string) => void;
  setSelectedFileName: (fileName: string) => void;
  setFileType: (fileType: string) => void;
  // setUploadResponse: (val: string[]) => void;
};

export const UploadFile = ({
  setFileTitle,
  setSelectedFileName,
  setFileType,
}: // setUploadResponse,
UploadFileProps) => {
  const { colorScheme } = useMantineColorScheme();
  const { borderColor } = useCustomColors();
  const [file, setFile] = useState<File | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileSizeUnit, setFileSizeUnit] = useState<string>("Bytes");
  const [uploadInitiated, setUploadInitiated] = useState<boolean>(false);
  const [uploadingStatus, setUploadingStatus] = useState<string | null>(null);
  const [totalParts, setTotalParts] = useState<number>(0);
  const [uploadedParts, setUploadedParts] = useState<number>(0);
  const [estTimeRemaining, setEstTimeRemaining] = useState<number>(0);
  const [isCalculatingEstimatedTime, setIsCalculatingEstimatedTime] =
    useState<boolean>(true);

  const convertFileSize = (selectedFile: File) => {
    const fileSizeIbBytes = selectedFile?.size;
    let fileSizeConverted = fileSizeIbBytes;
    let fileUnit = "Bytes";

    if (fileSizeConverted > 1024) {
      fileSizeConverted = fileSizeIbBytes / 1024;
      fileUnit = "KB";
    }

    if (fileSizeConverted > 1024) {
      fileSizeConverted = fileSizeConverted / 1024;
      fileUnit = "MB";
    }

    if (fileSizeConverted > 1024) {
      fileSizeConverted = fileSizeConverted / 1024;
      fileUnit = "GB";
    }

    setFileSize(Number(fileSizeConverted.toFixed(2)));
    setFileSizeUnit(fileUnit);
  };

  // const getFileList = async (file: File) => {
    // const reader = new ZipReader(new BlobReader(file));

    // Get all entries (files) in the ZIP
    // const entries = await reader.getEntries();

    // const fileNames = entries.map((entry) => entry.filename);

    // Close the reader
    // await reader.close();

    // return fileNames;
  // };

  const onDrop = (f: File[]) => {
    const selectedFile = f[0];

    if (selectedFile) {
      setFile(selectedFile);
      convertFileSize(selectedFile);

      // const selectedFileName = selectedFile.name;
      // const indexOfFileExtension = selectedFileName?.lastIndexOf(".");
      // const fileExtension = selectedFileName?.slice(indexOfFileExtension + 1);
      // const uniqueFileName = `${uniqId}.${fileExtension}`;
      // setFileName(uniqueFileName);
      // setFileName(selectedFileName);

      setFileTitle(selectedFile.name);
      setSelectedFileName(selectedFile.name);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileSize(0);
    setFileSizeUnit("Bytes");
  };

  const setFileInfo = async (file: File, uniqueId: string) => {
    console.log({uniqueId})
    // logic for setting states for NewFile.tsx component: start
    const fileType = file?.type;
    // const fileName = file?.name;

    // const indexOfFileExtension = fileName?.lastIndexOf(".");
    // const fileExtension = fileName?.slice(indexOfFileExtension + 1);
    // const uniqueFileName = `${uniqueId}.${fileExtension}`;

    setFileType("normalFile");
    // let fileList = [uniqueFileName];

    if (
      fileType &&
      (fileType === "application/zip" ||
        fileType === "application/x-zip-compressed")
    ) {
      setFileType("zipFile");
      // const list = await getFileList(file);
      // fileList = [uniqueFileName, ...list];
    }
    // setUploadResponse(fileList);
    // logic for setting states for NewFile.tsx component: end
  };

  const uploadFile = async () => {
    if (file) {
      setUploadInitiated(true);
      setUploadingStatus("progress");

      // // logic for setting states for NewFile.tsx component: start
      // const fileType = file.type;
      // setFileType("normalFile");
      // let fileList = [fileName];
      // if (
      //   fileType &&
      //   (fileType === "application/zip" ||
      //     fileType === "application/x-zip-compressed")
      // ) {
      //   setFileType("zipFile");
      //   const list = await getFileList(file);
      //   fileList = [fileName, ...list];
      // }
      // setUploadResponse(fileList);
      // // logic for setting states for NewFile.tsx component: end

      multipartUpload(file as File);
    }
  };

  // const sanitize = (tag: string) => {
  //   let newTag = tag.slice(1, tag.length - 1);
  //   return newTag;
  // };

  // const getStringHash = (input: string) => {
  //   return new Promise((resolve, reject) => {
  //     const hash = SparkMD5.hash(input);
  //     if (hash) {
  //       resolve(hash);
  //     } else {
  //       reject("Error: no hash");
  //     }
  //   });
  // };

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
          console.log("part uploaadedddddddddddd");
          // setUploadedParts();
          resolve({ id: partId, resp });
        })
        .catch((err) => {
          reject({ id: partId, resp: err });
        });
    });
  };

  const getUrlExpiry = (url: string) => {
    const indexOfLastEquals = url.lastIndexOf("=");
    const expiry = url?.slice(indexOfLastEquals + 1);
    return expiry;
  };

  const initiateFileUpload = async (file: File) => {
    const initiateFileUploadPayload = {
      file: {
        name: file?.name,
        size: file?.size,
        lastModified: file?.lastModified,
      },
    };

    const resp = await fetch(`${API_SERVER_URL}/initiate-file-upload`, {
      method: "POST",
      body: JSON.stringify(initiateFileUploadPayload),
    });

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

    const resp = await fetch(`${API_SERVER_URL}/update-file-part-urls`, {
      method: "POST",
      body: JSON.stringify(updateFilePartUrlsPayload),
    });

    const updateFilePartUrlsResponse = await resp.json();

    const { status, parts } = updateFilePartUrlsResponse;

    if (status?.success) {
      return parts;
    } else {
      return null;
    }
  };

  const updateFilePartsStatus = async (id: string, parts: PartType[]) => {
    const updateFilePartsStatusPayload = {
      id,
      parts,
    };

    const resp = await fetch(`${API_SERVER_URL}/update-file-parts-status`, {
      method: "POST",
      body: JSON.stringify(updateFilePartsStatusPayload),
    });

    const updateFilePartsStatusResponse = await resp.json();

    const {
      // parts: returnedParts,
      // status,
      upload_complete,
    } = updateFilePartsStatusResponse;

    return upload_complete;
  };

  const getEstimatedTime = (batchUploadTimeData: any, parts: PartType[]) => {
    const notUploadedChunks = parts.filter(
      (part) => part?.status === "upload_pending"
    );
    const batchIds = Object.keys(batchUploadTimeData);
    const batchTimes: number[] = Object.values(batchUploadTimeData);
    const batchParts = parts.filter((part) =>
      batchIds?.includes(String(part?.id))
    );
    const batchSize = batchParts.reduce((acc, curr) => acc + curr?.length, 0);
    const totalBatchTime = batchTimes.reduce((acc, curr) => acc + curr, 0);
    const avgBatchTime = totalBatchTime / batchIds?.length;

    const notUploadedChunksSize = notUploadedChunks.reduce(
      (acc, curr) => acc + curr?.length,
      0
    );
    const estTimeRemaining = (avgBatchTime * notUploadedChunksSize) / batchSize;

    return estTimeRemaining;
  };

  const multipartUpload = async (file: File) => {
    try {
      const id = await initiateFileUpload(file);

      if (id) {
        const parts = await updateFilePartsUrl(id);

        const maxNumOfParallelUploads = 4;
        if (parts) {
          let myParts: PartType[] = JSON.parse(JSON.stringify(parts));

          setTotalParts(myParts.length);

          if (myParts.every((part) => part?.status === "upload_verified")) {
            const uploadComplete = await updateFilePartsStatus(id, myParts);
            if (uploadComplete) {
              await setFileInfo(file, id);
              setUploadingStatus("completed");
            }
            // setUploadingStatus("completed");
            return;
          }

          const partsWithUploadComplete = myParts?.filter(
            (part) =>
              part?.status === "upload_complete" ||
              part?.status === "upload_verified"
          );

          setUploadedParts(partsWithUploadComplete?.length);
          let endLoop = false;

          while (
            myParts?.filter(
              (part: PartType) => part?.status === "upload_pending"
            )?.length > 0
          ) {
            const partsWithUploadPending = myParts?.filter(
              (part: PartType) => part?.status === "upload_pending"
            );

            const numPartsWithUploadPending = partsWithUploadPending.length;

            const numberOfParallelUploads = Math.min(
              numPartsWithUploadPending,
              maxNumOfParallelUploads
            );

            const partsToUpload = partsWithUploadPending?.slice(
              0,
              numberOfParallelUploads
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
                    (part: PartType) => part?.id === id
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
                  setUploadingStatus("failed");
                  endLoop = true;
                }
              });

              const estimatedTime = getEstimatedTime(
                batchUploadTimeData,
                myParts
              );
              setEstTimeRemaining(estimatedTime);
              setIsCalculatingEstimatedTime(false);

              if (endLoop) {
                break;
              }
              console.log("updating file part statusssssssssssssss");
              const uploadComplete = await updateFilePartsStatus(id, myParts);

              if (uploadComplete) {
                await setFileInfo(file, id);
                setUploadingStatus("completed");
              }
            } else {
              // urls expired
              const parts = await updateFilePartsUrl(id);

              if (parts) {
                myParts = JSON.parse(JSON.stringify(parts));
                // setPartsData(myParts)
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
      setUploadingStatus("failed");
    }
  };

  const convertTime = (timeInMs: number) => {
    let returnTime = timeInMs;
    let returnUnit = "ms";

    if (returnTime > 1000) {
      returnTime = Math.floor(returnTime / 1000);
      returnUnit = "sec";
    }

    if (returnTime > 60) {
      returnTime = Math.floor(returnTime / 60);
      returnUnit = "min";
    }

    if (returnTime > 60) {
      returnTime = Math.floor(returnTime / 60);
      returnUnit = "hr";
    }

    return { time: returnTime, unit: returnUnit };
  };

  return (
    <Box
      style={{
        border: `3px dashed ${borderColor}`,
        borderRadius: "4px",
        padding: "10px",
      }}
    >
      {file ? (
        uploadInitiated ? (
          <UploadingProcess
            fileName={file?.name}
            fileSize={fileSize}
            fileSizeUnit={fileSizeUnit}
            // percentageProgress={percentageProgress}
            percentageProgress={
              totalParts > 0 ? (uploadedParts * 100) / totalParts : 0
            }
            uploadingStatus={uploadingStatus}
            uploadFile={uploadFile}
            isCalculatingEstimatedTime={isCalculatingEstimatedTime}
            estTimeRemaining={convertTime(estTimeRemaining)}
          />
        ) : (
          <SelectedFileInfo
            fileName={file?.name}
            fileSize={fileSize}
            fileSizeUnit={fileSizeUnit}
            removeFile={removeFile}
            uploadFile={uploadFile}
          />
        )
      ) : (
        <Dropzone
          disabled={false}
          onDrop={onDrop}
          h="100%"
          styles={{ inner: { height: "100%" } }}
        >
          <Dropzone.Accept>
            <VCUploadIcon
              size="3.2rem"
              stroke={1.5}
              color={colorScheme === "dark" ? "#74c0fc" : "#339af0"}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <VCCloseIcon
              size="3.2rem"
              stroke={1.5}
              color={colorScheme === "dark" ? "#ffa8a8" : "#ff6b6b"}
            />
          </Dropzone.Reject>
          <Box
            w="100%"
            h="100%"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text size="sm" my={0} ta="center">
              Drag & Drop file here to upload
            </Text>
            <Text size="sm" my={0} ta="center">
              Or
            </Text>
            <Text size="sm" my={0} ta="center">
              Alternately, you can select file by
            </Text>
            <Text td="underline" size="sm" my={0} ta="center" color="blue">
              Clicking here
            </Text>
          </Box>
        </Dropzone>
      )}
    </Box>
  );
};
