import { useEffect, useRef, useState } from "react";

import { useStore } from "../../store";
import { itemApi } from "../../apiActions/itemApi";
import { ItemInfoTitle } from "../common/ItemInfo/ItemInfoTitle";
import { AlertMsgType } from "../../store/actionSlice";

interface TitleProps {
  itemId: string;
  itemType: string;
  title: string;
}

export const Title = ({ itemId, itemType, title }: TitleProps) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  // const addReloadComponent = useStore((state) => state.addReloadComponent);
  const setUpdatedItemMetadata = useStore((state) => state.setUpdatedItemMetadata);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputData, setInputData] = useState<string>(title);
  const [madeChanges, setMadeChanges] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMadeChanges(inputData !== title);
  }, [inputData]);

  const handleInputChange = (val: string) => {
    setInputData(val);
  };

  const postTitleChange = async () => {
    setLoading(true);

    const { data, error } = await itemApi?.updateItemMetadata(
      itemId,
      itemType,
      "title",
      inputData,
    );

    if (error) {
      handleInputChange(title);
      setLoading(false);
      return setDialogBoxMsg(error, AlertMsgType.ERROR);
    }

    setMadeChanges(false);
    setDialogBoxMsg("Title updated.", AlertMsgType.SUCCESS);
    setLoading(false);
    // addReloadComponent(itemType)
    setUpdatedItemMetadata(data)
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter" && !madeChanges) {
      event.preventDefault();
      inputRef?.current?.blur();
    }

    if (event.key === "Enter" && madeChanges) {
      event.preventDefault();
      inputRef?.current?.blur();
    }
  };

  const handleInputBlur = () => {
    if (madeChanges) {
      postTitleChange();
    }
  };

  return (
    <ItemInfoTitle
      title={inputData}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      onKeyDown={handleKeyPress}
      loading={loading}
    />
  );
};
