// hooks/useItemDragDrop.ts
import { useState } from "react";
import { useStore } from "../store";
import { fileApi } from "../apiActions/fileApi";
import type { ViewItemPropertyType } from "../store/viewSlice";
import { AlertMsgType } from "../store/actionSlice";
import type { ItemMetadataType } from "../types";

export const useItemDragDrop = (
  activeView: ViewItemPropertyType | undefined,
  itemsMetadata: ItemMetadataType[],
  fileItems: any[],
  setItemMetadata: React.Dispatch<React.SetStateAction<ItemMetadataType[]>>,
  setFileItems: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const addReloadComponent = useStore((state) => state.addReloadComponent);

  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, dragOverItemType: string) => {
    e.preventDefault();
    setDragOver(dragOverItemType);
  };

  const handleDragOverStart = (dragOverItemType: string) => {
    setDragOver(dragOverItemType);
  };

  const handleDragOverEnd = () => setDragOver(null);

  const getParentFolderValue = (): string | undefined => {
    const filters = activeView?.filters;
    const parentFolderFilter = filters?.filterType?.find(
      (filter) => filter?.filterTitle === "Parent Folder",
    );
    return parentFolderFilter?.value;
  };

  const handleOnDropFile = async (e: React.DragEvent, source?: string) => {
    setDragOver(null);

    if (source !== "file") return;

    const parentFolderItemId = getParentFolderValue();
    if (!parentFolderItemId) return;

    const item: ItemMetadataType = JSON.parse(
      e?.dataTransfer?.getData("dragItem"),
    );
    if (item.item_type !== "file") return;

    const file = fileItems?.find((file) => file?.id === item.id);
    if (!file) return;

    const dummyItem = {
      id: "dummy",
      title: "dummy",
      description: "",
      item_type: "dummy",
      tags: [],
      image: "",
      created_at: String(new Date()),
      last_modified_at: null,
      deleted_at: null,
      system_key: null,
    } as ItemMetadataType;

    const dummyFileItem = { id: "dummy", parent: parentFolderItemId };

    setItemMetadata([dummyItem, ...itemsMetadata]);
    setFileItems([dummyFileItem, ...fileItems]);

    const { error } = await fileApi.copyItemToAnotherFolder(
      item.id,
      parentFolderItemId,
    );

    setItemMetadata(itemsMetadata.filter((item) => item.id !== "dummy"));
    setFileItems(fileItems.filter((file) => file.id !== "dummy"));

    if (error) {
      console.error(error);
      return setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    }

    addReloadComponent("file");
  };

  return {
    dragOver,
    handleDragOver,
    handleDragOverStart,
    handleDragOverEnd,
    handleOnDropFile,
  };
};
