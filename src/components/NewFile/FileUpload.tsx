import { useEffect, useState } from "react";
import { Box, Group, Text, useMantineColorScheme } from "@mantine/core";
import {
  Dropzone,
  type DropzoneProps,
  type FileWithPath,
} from "@mantine/dropzone";
import { VCUploadIcon, VCCloseIcon } from "../../assets/icons";
import { useCustomColors } from "../../customHooks/useCustomColors";
import { FileUploadInfo } from "./FileUploadInfo";

interface FileUploadProps extends Partial<DropzoneProps> {
  disabled: boolean;
  removeFile: boolean;
  onDrop: (file: any) => void;
  onRemoveFile: () => void;
}

export const FileUpload = ({
  disabled,
  removeFile,
  onDrop,
  onRemoveFile,
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileSizeUnit, setFileSizeUnit] = useState<string>("Bytes");

  const theme = useMantineColorScheme();
  const { borderColor } = useCustomColors();

  useEffect(() => {
    if (removeFile) {
      handleRemoveFile();
    }
  }, [removeFile]);

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

  const onFileDrop = (files: FileWithPath[]) => {
    const file = files[0];
    convertFileSize(file);
    onDrop(file);
    setFile(file);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileSize(0);
    setFileSizeUnit("Bytes");
    onRemoveFile();
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
        <FileUploadInfo
          fileName={file?.name}
          fileSize={fileSize}
          fileSizeUnit={fileSizeUnit}
          removeFile={handleRemoveFile}
        />
      ) : (
        <Dropzone
          disabled={disabled}
          style={{ backgroundColor: "unset", border: "unset" }}
          onDrop={onFileDrop}
          h="100%"
        >
          <Group
            justify="center"
            // style={{ minHeight: `rem${220}`, pointerEvents: "none" }}
            style={{ minHeight: '114px', pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <VCUploadIcon
                size="3.2rem"
                stroke={1.5}
                color={theme.colorScheme === "dark" ? "#74c0fc" : "#339af0"}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <VCCloseIcon
                size="3.2rem"
                stroke={1.5}
                color={theme.colorScheme === "dark" ? "#ffa8a8" : "#ff6b6b"}
              />
            </Dropzone.Reject>

            <div>
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
            </div>
          </Group>
        </Dropzone>
      )}
    </Box>
  );
};
