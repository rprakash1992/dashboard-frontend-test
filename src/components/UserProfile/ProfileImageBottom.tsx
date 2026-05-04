import { useRef } from "react";
import { Avatar, Box, Button, Group, Stack } from "@mantine/core";

interface ProfileImageBottomProps {
  profilePicture: string | null;
  isUploading: boolean;
  isRemoving: boolean;
  handleImageUpload: (files: FileList | null) => void;
  handleRemoveImage: () => void;
}

export const ProfileImageBottom = ({
  profilePicture,
  isUploading,
  isRemoving,
  handleImageUpload,
  handleRemoveImage,
}: ProfileImageBottomProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Box w="100%">
      <Group justify="space-between" my={10}>
        <Avatar src={profilePicture} size={90} radius="50%" />
        <Stack>
          <Button
            disabled={isUploading || isRemoving}
            loading={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {!profilePicture ? "Add" : "Update"}
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <Button
            disabled={isUploading || isRemoving || !profilePicture}
            loading={isRemoving}
            variant="outline"
            onClick={handleRemoveImage}
          >
            Remove
          </Button>
        </Stack>
      </Group>
    </Box>
  );
};
