import { memo, useCallback } from "react";
import { useNavigate } from "react-router";
import { Alert, Box, Group } from "@mantine/core";
import { useCustomColors } from "../../customHooks/useCustomColors";
import { ProfileAvatar } from "../ProfileAvatar/ProfileAvatar";
import { AppLogo } from "../AppLogo";
import { WorkspaceHeaderText } from "../WorkspaceHeaderText/WorkspaceHeaderText";
import { useStore } from "../../store";
import { SearchItems } from "../SearchItems";
import { VCInfoIcon } from "../../assets/icons";

const headerHeight = 62;

export const AppHeader = memo(() => {
  const profilePending = useStore((state) => state.profilePending);
  const userProfile = useStore((state) => state.userProfile);
  const { borderColor } = useCustomColors();
  const navigate = useNavigate();

  const onProfileAvatarClick = useCallback(
    () => navigate("/my-profile?tabId=profile_tab&tabTitle=Profile"),
    [],
  );

  const onWorkspaceIconClick = useCallback(
    () => navigate("/my-workspaces?tabId=workspaces_list&tabTitle=Workspaces"),
    [],
  );

  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 10px",
        height: `${headerHeight}px`,
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      <Box>
        <AppLogo />
      </Box>
      <Box>
        {profilePending && (
          <Alert
            variant="transparent"
            color="blue"
            title="Your profile is pending for approval. Please contact admin."
            icon={<VCInfoIcon />}
          ></Alert>
        )}
      </Box>
      <Group align="center" justify="center" gap="xs">
        <SearchItems />
        <WorkspaceHeaderText onClick={onWorkspaceIconClick} />
        <ProfileAvatar
          picture={userProfile?.picture}
          onClick={onProfileAvatarClick}
        />
      </Group>
    </Box>
  );
});
