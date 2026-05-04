import {
  Box,
  Text,
  // Button,
} from "@mantine/core";

import { VCCloseIcon } from "../../assets/icons";

type SelectedFileInfoProps = {
  fileName: string;
  fileSize: number;
  fileSizeUnit: string;
  removeFile: () => void;
  uploadFile: () => void;
};

export const SelectedFileInfo = ({
  fileName,
  fileSize,
  fileSizeUnit,
  removeFile,
  // uploadFile,
}: SelectedFileInfoProps) => {
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
      {/* <Box style={{ display: "flex", justifyContent: "center" }}>
        <
        
        variant="subtle"
        conUpload,
        // rightSection={<
          size={14} />}
          onClick={uploadFile}
        >
          Upload
        </Button>
        <Button
          variant="subtle"
          rightSection={<VCCloseIcon size={14} />}
          onClick={removeFile}
        >
          Remove
        </Button>
      </Box> */}
    </Box>
  );
};
