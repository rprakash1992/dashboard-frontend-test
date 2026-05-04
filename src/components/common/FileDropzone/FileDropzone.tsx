import { Group, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IMAGE_MIME_TYPE } from "@mantine/dropzone";

import { VCCloseIcon, VCPhotoIcon, VCUploadIcon } from "../../../assets/icons";

function FileDropzone({ onDrop, onReject, loading, ...props }: any) {
  return (
    <Dropzone
      onDrop={onDrop}
      onReject={onReject}
      loading={loading}
      maxSize={5 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      {...props}
    >
      <Group
        justify="center"
        gap="xl"
        // mih={220}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <VCUploadIcon
            size={42}
            color="var(--mantine-color-blue-6)"
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <VCCloseIcon
            size={42}
            color="var(--mantine-color-red-6)"
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <VCPhotoIcon
            size={42}
            color="var(--mantine-color-dimmed)"
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="sm" inline>
            Drag images here or click to select files
          </Text>
          {/* <Text size="sm" c="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text> */}
        </div>
      </Group>
    </Dropzone>
  );
}

export default FileDropzone;
