import { Button, Space, Tooltip, useMantineColorScheme } from "@mantine/core";

import { useStore } from "../../store";
import { ItemTitle } from "../common/ItemTitle/ItemTitle";
import {
  // VCMyWorkspacesIcon,
  VCWorkspaceIcon,
} from "../../assets/icons";

export const WorkspaceHeaderText = ({ onClick }: any) => {
  const selectedWorkspace = useStore((state) => state.selectedWorkspace);
  const { colorScheme } = useMantineColorScheme();

  return (
    <Tooltip label="Workspace">
      <Button
        variant="subtle"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        c={colorScheme === "dark" ? "#c9c9c9" : "#212529"}
        onClick={onClick}
      >
        {/* <VCMyWorkspacesIcon stroke={1} /> */}
        <VCWorkspaceIcon stroke={1} />
        <Space w="8px" />
        <ItemTitle title={selectedWorkspace?.title} />
      </Button>
    </Tooltip>
  );
};
