import { useState } from "react";
import { Box, Select } from "@mantine/core";
import { useStore } from "../../store";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { SubmitButton } from "../common/SubmitButton/SubmitButton";
import { workspaceApi } from "../../apiActions/workspaceApi";
import { AlertMsgType } from "../../store/actionSlice";

interface MoveItemToWorkspaceProps {
  itemId: string;
}

const MoveItemToWorkspace = ({ itemId }: MoveItemToWorkspaceProps) => {
  const myWorkspaces = useStore((state) => state.myWorkspaces);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null,
  );
  const [loadingMoveItemToWorkspace, setLoadingMoveItemToWorkspace] =
    useState<boolean>(false);

  const onAdd = async () => {
    try {
      if (!selectedWorkspaceId) {
        return setDialogBoxMsg("Select a workspace", AlertMsgType.ERROR);
      }

      if (!itemId) {
        return setDialogBoxMsg("Select an item", AlertMsgType.ERROR);
      }

      setLoadingMoveItemToWorkspace(true);

      const { error } = await workspaceApi.addItemToWorkspace(
        selectedWorkspaceId,
        itemId,
      );

      if (error) {
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      setDialogBoxMsg("Item shared.", AlertMsgType.SUCCESS);
    } catch (err) {
      setDialogBoxMsg(String(err), AlertMsgType.ERROR);
    } finally {
      setLoadingMoveItemToWorkspace(false);
    }
  };

  return (
    <MaxWidthContainer>
      <Box
        style={{
          padding: "10px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <Select
          label="Workspace:"
          placeholder="Select Workspace"
          data={myWorkspaces.map((ws) => ({ label: ws.title, value: ws.id }))}
          nothingFoundMessage="No workspace found..."
          onChange={setSelectedWorkspaceId}
          checkIconPosition="right"
          mb="10px"
        />
        <SubmitButton
          isLoading={loadingMoveItemToWorkspace}
          label="Share"
          onSubmit={onAdd}
        />
      </Box>
    </MaxWidthContainer>
  );
};

export default MoveItemToWorkspace;
