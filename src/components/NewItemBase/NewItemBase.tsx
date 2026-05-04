import { Box, Space } from "@mantine/core";
import { ItemInfoTitle } from "../common/ItemInfo/ItemInfoTitle";
import { ItemInfoDescription } from "../common/ItemInfo/ItemInfoDescription";
import { ItemInfoCategories } from "../common/ItemInfo/ItemInfoCategories";

interface NewItemBaseProps {
  itemTitle: string;
  itemDescription: string;
  categories: string[];
  withoutTitle?: boolean;
  setItemTitle: (title: string) => void;
  setItemDescription: (description: string) => void;
  setCategories: (categories: string[]) => void;
}

export const NewItemBase = ({
  itemTitle,
  itemDescription,
  categories,
  withoutTitle,
  setItemTitle,
  setItemDescription,
  setCategories,
}: NewItemBaseProps) => {
  return (
    <Box>
      {!withoutTitle && (
        <>
          <ItemInfoTitle title={itemTitle} onChange={setItemTitle} />
          <Space h="xs" />
        </>
      )}
      <ItemInfoDescription
        value={itemDescription}
        onChange={setItemDescription}
      />
      <Space h="xs" />
      <ItemInfoCategories
        tags={categories}
        onAddClick={async (tags) => setCategories(tags)}
        onRemoveClick={async (tags) => setCategories(tags)}
      />
    </Box>
  );
};
