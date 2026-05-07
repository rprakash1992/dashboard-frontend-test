import { useState } from "react";
import { Stack } from "@mantine/core";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { SubmitButton } from "../common/SubmitButton/SubmitButton";
import { NewItemBase } from "../NewItemBase/NewItemBase";
import { useStore } from "../../store";
import { AlertMsgType } from "../../store/actionSlice";
import { RolePermissions, DEFAULT_PERMISSIONS } from "./RolePermissions";
import type { RolePermission } from "./RolePermissions";
import { roleApi } from "../../apiActions/roleApi";

export const NewRole = () => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const setNewItemMetadata = useStore((state) => state.setNewItemMetadata);
  const [loadingAddItem, setLoadingAddItem] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [permissions, setPermissions] =
    useState<RolePermission[]>(DEFAULT_PERMISSIONS);

  const handleAddItem = async () => {
    console.log({ title, description, categories, permissions });
    try {
      setLoadingAddItem(true);
      const { data, error } = await roleApi.insertRole(
        title,
        description,
        "",
        categories,
        permissions,
      );

      if (error) {
        return setDialogBoxMsg(String(error), AlertMsgType.ERROR);
      }

      setDialogBoxMsg("Role added successfully", AlertMsgType.SUCCESS);
      setNewItemMetadata(data.item);
    } catch (error) {
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setLoadingAddItem(false);
    }
  };

  return (
    <MaxWidthContainer>
      <Stack p="xs" gap="xs">
        <RolePermissions permissions={permissions} onChange={setPermissions} />
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
          onSubmit={handleAddItem}
          isLoading={loadingAddItem}
        />
      </Stack>
    </MaxWidthContainer>
  );
};
