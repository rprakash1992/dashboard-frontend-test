import { useState } from "react";

import { useStore } from "../../store";
import { itemApi } from "../../apiActions/itemApi";
import { ItemInfoCategories } from "../common/ItemInfo/ItemInfoCategories";
import { AlertMsgType } from "../../store/actionSlice";

interface CategoriesProps {
  itemId: string;
  itemType: string;
  tags: string[];
}

export const Categories = ({
  itemId,
  itemType,
  tags: itemTags,
}: CategoriesProps) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const updateStoreTags = useStore((state) => state.updateTags);
  const [loading, setLoading] = useState<boolean>(false);

  const updateTags = async (updatedTags: string[], newTag?: string) => {
    try {
      setLoading(true);
      const { error: itemMetadataErr } = await itemApi.updateItemMetadata(
        itemId,
        itemType,
        "tags",
        updatedTags,
      );

      if (itemMetadataErr) {
        return setDialogBoxMsg(itemMetadataErr, AlertMsgType.ERROR);
      }

      if (newTag) {
        updateStoreTags({ name: newTag, description: null });
      }
      setDialogBoxMsg("Tags updated successfully.", AlertMsgType.SUCCESS);
    } catch (error) {
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  // const handleAddText = async (updatedTags: string[], newTag: string) => {
  //   setLoading(true);
  //   await updateTags(updatedTags, newTag);
  // };

  // const handleTextRemove = async (updatedTags: string[]) => {
  //   await updateTags(updatedTags);
  // };

  return (
    <ItemInfoCategories
      tags={itemTags}
      loading={loading}
      onAddClick={updateTags}
      onRemoveClick={updateTags}
    />
  );
};
