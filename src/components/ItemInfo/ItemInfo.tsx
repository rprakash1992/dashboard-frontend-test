import { useEffect, useState } from "react";
import { Box, Stack } from "@mantine/core";

import { useStore } from "../../store";
import type { ItemMetadataType } from "../../types";
import { getTimeLapsed } from "../../utils/misc";
import { itemApi } from "../../apiActions/itemApi";
import { Label } from "../common/Label/Label";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";
import { ErrorComponent } from "../ErrorComponent/ErrorComponent";
import { Categories } from "./Categories";
import { LabelValue } from "../common/LabelValue/LabelValue";
import { Title } from "./Title";
import { Description } from "./Description";
import { Image } from "./Image";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { AlertMsgType } from "../../store/actionSlice";

interface ItemInfoProps {
  itemId: string;
}

const ItemInfo = ({ itemId }: ItemInfoProps) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [item, setItem] = useState<ItemMetadataType | null>(null);

  useEffect(() => {
    if (itemId) {
      fetchItem(itemId);
    }
  }, [itemId]);

  const fetchItem = async (id: string) => {
    try {
      const { data, error } = await itemApi.getItemByIds([id]);

      if (error) {
        setIsLoading(false);
        setErrorState(true);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (data?.length > 0) {
        const item = data[0];
        setItem(item);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setErrorState(true);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    }
  };

  // const updateItem = (field: string) => (value: any) => {
  //   setItem({
  //     ...(item as ItemMetadataType),
  //     [field]: value,
  //   });
  // };

  return (
    <MaxWidthContainer>
      {isLoading ? (
        <LoadingComponent />
      ) : errorState ? (
        <ErrorComponent />
      ) : item ? (
        <Stack p="10px" gap="xs">
          <Title
            itemId={itemId}
            itemType={item.item_type}
            title={item.title ?? ""}
          />
          <Description
            itemId={itemId}
            itemType={item.item_type}
            description={item.description ?? ""}
          />
          <Image
            itemId={itemId}
            itemType={item.item_type ?? ""}
            itemImage={item.image ?? ""}
          />
          <Categories
            itemId={itemId}
            itemType={item.item_type ?? ""}
            tags={item.tags ?? []}
          />
          <Box>
            <Label label="Created" />
            <LabelValue labelValue={getTimeLapsed(item.created_at ?? "")} />
          </Box>
          <Box>
            <Label label="Modified" />
            <LabelValue
              labelValue={getTimeLapsed(item.last_modified_at ?? "")}
            />
          </Box>
        </Stack>
      ) : null}
    </MaxWidthContainer>
  );
};

export default ItemInfo;
