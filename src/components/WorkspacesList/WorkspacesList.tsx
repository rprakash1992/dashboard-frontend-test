import { Box } from "@mantine/core";

import { InfoPanel } from "../InfoPanel";
import { useStore } from "../../store";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";

interface WorkspacesListProps {
  deleteAllTabset: () => void;
}

const WorkspacesList = ({ deleteAllTabset }: WorkspacesListProps) => {
  const myWorkspaces = useStore((state) => state.myWorkspaces);
  const selectedWorkspace = useStore((state) => state.selectedWorkspace);
  const setSelectedWorkspace = useStore((state) => state.setSelectedWorkspace);

  const onSelect = (e: any, workspaceDetail: any) => {
    e?.stopPropagation();
    deleteAllTabset();
    localStorage.setItem(
      "vc-dashboard-workspace",
      JSON.stringify(workspaceDetail)
    );
    setSelectedWorkspace(workspaceDetail as any);
  };

  return (
    <MaxWidthContainer>
      <Box p="10px">
        {myWorkspaces?.map((ws) => (
          <InfoPanel
            key={ws?.id}
            keyName={ws?.id as string}
            title={ws?.title}
            // subTitle={ws?.role_title}
            // secondTitle={ws?.title}
            showCheckIcon={true}
            onClick={(e: any) => onSelect(e, ws)}
            picture={ws?.image as string}
            isChecked={selectedWorkspace?.id === ws?.id}
            // onCheckIconClick={(e: any) => onSelect(e, ws)}
          />
        ))}
      </Box>
    </MaxWidthContainer>
  );
};

export default WorkspacesList;
