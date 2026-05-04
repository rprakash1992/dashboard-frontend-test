import { Pill } from "@mantine/core";

interface OneCategoryItemProps {
  categoryName: string;
  onRemove: () => void;
}

export const OneCategoryItem = ({
  categoryName,
  onRemove,
}: OneCategoryItemProps) => {
  return (
    <Pill withRemoveButton size="lg" onRemove={onRemove}>
      {categoryName}
    </Pill>
  );
};
