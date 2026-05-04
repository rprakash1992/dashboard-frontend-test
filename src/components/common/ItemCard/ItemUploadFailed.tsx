import { useState } from "react";
import { Box, Card, Text, Tooltip, useMantineColorScheme } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useCustomColors } from "../../../customHooks/useCustomColors";
// import { multipartUpload } from "../../../utils/fileUploadUtils";
import { useStore } from "../../../store";
import { VCUploadIcon, VCCloseIcon } from "../../../assets/icons";
import { useMultipartUpload } from "../../../customHooks/useMultipartUpload";

function ItemUploadFailed({
  itemId,
  fileExtension,
}: {
  itemId: string;
  fileExtension: string | null;
}) {
  const fileUploads = useStore((state) => state.fileUploads);
  const addUpdateFileUpload = useStore((state) => state.addUpdateFileUpload);
  const multipartUpload = useMultipartUpload();

  const fileUpload = fileUploads[itemId];
  const { colorScheme } = useMantineColorScheme();
  const { borderColor } = useCustomColors();
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (files: File[]) => {
    setFile(files[0]);
  };

  const uploadFile = () => {
    // const fileKey = fileUpload.fileKey;
    const fileUrl = `${itemId}.${fileExtension}`;
    const metadataId = itemId;
    multipartUpload(file as File, metadataId, fileUrl);
    addUpdateFileUpload(itemId, {
      ...fileUpload,
      status: "progress",
      isCalculatingEstimatedTime: true,
    });
  };

  return (
    <Card
      shadow="sm"
      radius="sm"
      p="sm"
      pl="0"
      style={{
        overflow: "visible",
        borderColor,
        border: `3px dashed ${borderColor}`,
        marginBottom: "10px",
      }}
    >
      {file ? (
        <Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text size="xs" ml="10px" c="#E23636">
              Upload Failed
            </Text>
          </Box>
          <Box mt="10px" style={{ display: "flex", flexDirection: "row" }}>
            <Box style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Text size="sm" ml="10px">
                {file?.name}
              </Text>
            </Box>
            <Box
              style={{
                width: "60px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Tooltip label="Upload">
                <VCUploadIcon
                  style={{ cursor: "pointer" }}
                  onClick={uploadFile}
                />
              </Tooltip>
              <Tooltip label="Remove">
                <VCCloseIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => setFile(null)}
                />
              </Tooltip>
            </Box>
          </Box>
        </Box>
      ) : (
        <Dropzone
          disabled={false}
          onDrop={onDrop}
          h="100%"
          style={{ cursor: "pointer" }}
          styles={{ inner: { height: "100%" } }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text size="xs" ml="10px" c="#E23636">
              Upload Failed
            </Text>
          </Box>
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
          <Box w="100%" h="100%" mt="10px">
            <Text size="xs" ml="10px">
              Select the file again to resume
            </Text>
          </Box>
        </Dropzone>
      )}
    </Card>
  );
}

export default ItemUploadFailed;
