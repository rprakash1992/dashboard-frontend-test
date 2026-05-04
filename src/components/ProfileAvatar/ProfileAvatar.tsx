import { memo } from "react";
import { Avatar, Box } from "@mantine/core";

type ProfileAvatarProps = {
  picture: string;
  onClick: () => void;
};

export const ProfileAvatar = memo(
  ({ picture, onClick }: ProfileAvatarProps) => {
    return (
      <Box>
        <Avatar
          style={{ cursor: "pointer" }}
          src={picture}
          size={"md"}
          radius="50%"
          onClick={onClick}
          alt="user_profile_image"
        />
      </Box>
    );
  }
);
