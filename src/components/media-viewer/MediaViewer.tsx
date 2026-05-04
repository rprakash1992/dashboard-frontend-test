import { Box, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { fileApi } from "../../apiActions/fileApi";
import { useStore } from "../../store";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";
import { ImageViewer } from "./ImageViewer";
import { VideoViewer } from "./VideoViewer";
import { AlertMsgType } from "../../store/actionSlice";

const FileExtensionsEnum = {
  JPG: "jpg",
  PNG: "png",
  JPEG: "jpeg",
  MP4: "mp4",
};

type FileExtensions =
  (typeof FileExtensionsEnum)[keyof typeof FileExtensionsEnum];

interface MediaViewerProps {
  itemId: string;
}

const MediaViewer = ({ itemId }: MediaViewerProps) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [fileExtension, setFileExtension] = useState<FileExtensions | null>(
    null,
  );

  useEffect(() => {
    fetchFata();
  }, []);

  const fetchFata = async () => {
    setIsLoading(true);

    try {
      const [fileDetailsResponse, downloadFileResponse] =
        await Promise.allSettled([
          fileApi.fetchFilesByIds([itemId]),
          fileApi.downloadFile(itemId),
        ]);

      if (fileDetailsResponse.status === "rejected") {
        setIsLoading(false);
        return setDialogBoxMsg(fileDetailsResponse.reason, AlertMsgType.ERROR);
      }

      if (downloadFileResponse.status === "rejected") {
        setIsLoading(false);
        return setDialogBoxMsg(downloadFileResponse.reason, AlertMsgType.ERROR);
      }

      const { data: fileDetailsData, error: fileDetailsError } =
        fileDetailsResponse.value;
      const { data: downloadFileData, error: downloadFileError } =
        downloadFileResponse.value;

      if (fileDetailsError) {
        setIsLoading(false);
        return setDialogBoxMsg(String(fileDetailsError), AlertMsgType.ERROR);
      }

      if (downloadFileError) {
        setIsLoading(false);
        return setDialogBoxMsg(String(downloadFileError), AlertMsgType.ERROR);
      }

      setDownloadUrl(downloadFileData);
      setFileExtension(fileDetailsData[0].mime_type);
    } catch (error) {
      console.error(error);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!fileExtension) {
    return (
      <Box>
        <Text>No valid media file type found.</Text>
      </Box>
    );
  }

  return (
    <Box w="100%" h="100%">
      {(fileExtension === FileExtensionsEnum.JPG ||
        fileExtension === FileExtensionsEnum.JPEG ||
        fileExtension === FileExtensionsEnum.PNG) && (
        <ImageViewer imageUrl={downloadUrl} />
      )}
      {fileExtension === FileExtensionsEnum.MP4 && (
        <VideoViewer videoUrl={downloadUrl} />
      )}
    </Box>
  );
};

export default MediaViewer;
