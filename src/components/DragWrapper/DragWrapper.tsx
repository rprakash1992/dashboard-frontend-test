import { Box } from "@mantine/core";
import type { ItemMetadataType } from "../../types";

interface DragWrapperProps {
  item: ItemMetadataType;
  children: React.ReactNode;
}

export const isDraggable = (itemType: string) =>
  itemType === "file" || itemType === "project" || itemType === "report";

export const DragWrapper = ({ item, children }: DragWrapperProps) => {
  const handleDrag = (e: React.DragEvent, item: ItemMetadataType) => {
    e?.dataTransfer?.setData("dragItem", JSON.stringify(item));
  };

  return (
    <>
      {isDraggable(item?.item_type) ? (
        <Box
          style={{
            cursor: "grab",
          }}
          draggable
          onDragStart={(e) => handleDrag(e, item)}
        >
          {children}
        </Box>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
