import { Box, Text } from "@mantine/core";

import { VCCloseIcon } from "../../assets/icons";

interface FileUploadInfoType {
  fileName: string;
  fileSize: number;
  fileSizeUnit: string;
  removeFile: () => void;
}

export const FileUploadInfo = ({
  fileName,
  fileSize,
  fileSizeUnit,
  removeFile,
}: FileUploadInfoType) => {
  return (
    <Box>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "space-between",
        }}
      >
        <Box style={{ display: "flex", flex: 1, flexDirection: "column" }}>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <Text
              size="sm"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              File Name: {fileName}
            </Text>
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <Text
              size="sm"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              File Size: {fileSize} {fileSizeUnit}
            </Text>
          </Box>
        </Box>
        <Box>
          <VCCloseIcon onClick={removeFile} style={{ cursor: "pointer" }} />
        </Box>
      </Box>
    </Box>
  );
};
