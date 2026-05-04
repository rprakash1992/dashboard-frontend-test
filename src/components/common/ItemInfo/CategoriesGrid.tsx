import { Box, Pill, Text } from "@mantine/core";

import { OneCategoryItem } from "./OneCategoryItem";

interface CategoriesGridProps {
  categories: string[];
  onCategoryRemove: (category: string) => void;
}

export const CategoriesGrid = ({
  categories,
  onCategoryRemove,
}: CategoriesGridProps) => {
  return (
    <Box mih={69}>
      {categories.length === 0 ? (
        <Text>No categories found.</Text>
      ) : (
        <Pill.Group>
          {categories.map((category: any) => (
            <OneCategoryItem
              key={category}
              categoryName={category}
              onRemove={() => onCategoryRemove(category)}
            />
          ))}
        </Pill.Group>
      )}
    </Box>
  );
};
