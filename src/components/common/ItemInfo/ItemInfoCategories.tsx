import { useEffect, useState } from "react";
import { Box, Flex, Card, Select } from "@mantine/core";
import { useStore } from "../../../store";
import type { TagType } from "../../../store/tagSlice";
import { CategoriesGrid } from "./CategoriesGrid";
import { Label } from "../Label/Label";
import { SubmitButton } from "../SubmitButton/SubmitButton";

interface ItemInfoCategoriesProps {
  tags: string[];
  loading?: boolean;
  onAddClick?: (tags: string[], newTag: string) => Promise<void>;
  onRemoveClick?: (tags: string[]) => Promise<void>;
}

export const ItemInfoCategories = ({
  tags: itemTags,
  loading,
  onAddClick,
  onRemoveClick,
}: ItemInfoCategoriesProps) => {
  const allTags = useStore((state) => state.tags);
  const [searchValue, setSearchValue] = useState("");
  const [availableTagsForItem, setAvailableTagsForItem] = useState<TagType[]>();
  const [itemTagsState, setItemTagsState] = useState<string[]>(() =>
    itemTags.map((tag) => tag.toLowerCase()),
  );

  useEffect(() => {
    setItemTagsState(itemTags.map((tag) => tag.toLowerCase()));
  }, [itemTags]);

  useEffect(() => {
    const remainingTags = allTags.filter(
      (tag) => !itemTagsState.includes(tag.name.toLowerCase()),
    );

    setAvailableTagsForItem(remainingTags);
  }, [itemTagsState, allTags]);

  const onAdd = async () => {
    if (!itemTagsState.includes(searchValue.toLowerCase())) {
      const updatedTags = [...itemTagsState, searchValue.toLowerCase()];

      if (onAddClick) {
        await onAddClick(updatedTags, searchValue);
      }
      setItemTagsState(updatedTags);
    }
    setSearchValue("");
  };

  const onRemove = async (tag: string) => {
    const updatedTags = itemTagsState.filter(
      (itemTag) => itemTag !== tag.toLowerCase(),
    );

    if (onRemoveClick) {
      await onRemoveClick(updatedTags);
    }
    setItemTagsState(updatedTags);
  };

  return (
    <Box>
      <Label label="Categories" />
      <Card style={{ overflow: "visible" }} withBorder p="sm">
        <Flex gap="sm" justify="center" direction="column" wrap="wrap">
          <CategoriesGrid
            categories={itemTagsState}
            onCategoryRemove={onRemove}
          />
          <Flex direction="row" justify="space-between" gap="sm">
            <Box style={{ flex: 1 }}>
              <Select
                disabled={loading}
                placeholder="Select or type new category"
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                data={availableTagsForItem?.map((i) => i?.name) || []}
                searchable
                onBlur={() => setSearchValue(searchValue)}
              />
            </Box>
            <Box style={{ width: "64px" }}>
              <SubmitButton
                label="Add"
                onSubmit={onAdd}
                isLoading={loading}
                isDisabled={!searchValue || loading}
              />
              {/* <Button
                disabled={!searchValue || loading}
                loading={loading}
                onClick={onAdd}
              >
                Add
              </Button> */}
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
};
