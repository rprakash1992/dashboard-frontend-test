import { useState } from "react";
import { Stack } from "@mantine/core";
import { useStore } from "../../store";
import { SubmitButton } from "../common/SubmitButton/SubmitButton";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { NewItemBase } from "../NewItemBase/NewItemBase";
import { workspaceApi } from "../../apiActions/workspaceApi";
import { AlertMsgType } from "../../store/actionSlice";

const NewWorkspace = () => {
  const myWorkspaces = useStore((state) => state.myWorkspaces);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const setMyWorkspaces = useStore((state) => state.setMyWorkspaces);
  const addReloadComponent = useStore((state) => state.addReloadComponent);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addNewWorkspace = async () => {
    if (!title) {
      return setDialogBoxMsg("Enter workspace title.", AlertMsgType.ERROR);
    }

    try {
      setIsLoading(true);

      const { data, error } = await workspaceApi.insertWorkspace(
        title,
        description,
        "",
        categories,
      );

      if (error) {
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      setMyWorkspaces([...myWorkspaces, data]);
      setTitle("");
      setDescription("");
      setDialogBoxMsg("Workspace created.", AlertMsgType.SUCCESS);

      addReloadComponent("workspace");
    } catch (error) {
      console.error(error);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MaxWidthContainer>
      <Stack p="xs" gap="xs">
        <NewItemBase
          itemTitle={title}
          itemDescription={description}
          categories={categories}
          setItemTitle={setTitle}
          setItemDescription={setDescription}
          setCategories={async (tags) => setCategories(tags)}
        />
        <SubmitButton
          label="Add"
          onSubmit={addNewWorkspace}
          isLoading={isLoading}
        />
      </Stack>
    </MaxWidthContainer>
  );
};

export default NewWorkspace;
