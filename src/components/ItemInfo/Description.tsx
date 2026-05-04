import { useEffect, useRef, useState } from "react";
import { Box } from "@mantine/core";

import { useStore } from "../../store";
import { itemApi } from "../../apiActions/itemApi";
import { ItemInfoDescription } from "../common/ItemInfo/ItemInfoDescription";
import { AlertMsgType } from "../../store/actionSlice";

interface DescriptionType {
  itemId: string;
  itemType: string;
  description: string | null;
}

export const Description = ({
  itemId,
  itemType,
  description,
}: DescriptionType) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  // const addReloadComponent = useStore((state) => state.addReloadComponent);
  const setUpdatedItemMetadata = useStore((state) => state.setUpdatedItemMetadata);
  const [loading, setLoading] = useState<boolean>(false);
  const [descriptionData, setDescriptionData] = useState<string | null>(
    description,
  );
  const [madeChanges, setMadeChanges] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMadeChanges(descriptionData !== description);
  }, [descriptionData]);

  const handleDescriptionSave = async () => {
    setLoading(true);
    const { data, error } = await itemApi?.updateItemMetadata(
      itemId,
      itemType,
      "description",
      descriptionData,
    );

    if (error) {
      handleInputChange(description as string);
      setLoading(false);
      return setDialogBoxMsg(error, AlertMsgType.ERROR);
    }

    setDescriptionData(descriptionData);
    setMadeChanges(false);
    setDialogBoxMsg("Description updated.", AlertMsgType.SUCCESS);
    setLoading(false);
    setUpdatedItemMetadata(data);
    // addReloadComponent(itemType);
  };

  const handleInputChange = (val: string) => {
    setDescriptionData(val);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      if (!madeChanges) {
        event.preventDefault();
        textareaRef?.current?.blur();
      }
      if (madeChanges) {
        event.preventDefault();
        textareaRef?.current?.blur();
      }
    }
  };

  const handleOnBlur = () => {
    if (madeChanges) {
      handleDescriptionSave();
    }
  };

  return (
    <Box>
      <ItemInfoDescription
        ref={textareaRef}
        rows={6}
        value={descriptionData as string}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleOnBlur}
        disabled={loading}
      />
    </Box>
  );
};
