import { Box } from "@mantine/core";

interface DropCompProps {
  children: React.ReactNode;
  source: string;
  dragOver: boolean;
  handleOnDrop: (e: React.DragEvent, source: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragOverStart: () => void;
  handleDragOverEnd: () => void;
}

export const DropWrapper = ({
  children,
  source,
  dragOver,
  handleOnDrop,
  handleDragOver,
  handleDragOverEnd,
  handleDragOverStart,
}: DropCompProps) => {
  return (
    <Box>
      <Box
        style={{
          border: dragOver ? "0.2rem dashed #0054A6" : "none",
        }}
        onDrop={(e) => handleOnDrop(e, source)}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOverStart}
        onDragLeave={handleDragOverEnd}
      >
        {children}
      </Box>
    </Box>
  );
};
