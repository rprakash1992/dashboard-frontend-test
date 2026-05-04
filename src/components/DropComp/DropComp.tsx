import { Box, Text } from "@mantine/core";

import { Label } from "../common/Label/Label";
import { useCustomColors } from "../../customHooks/useCustomColors";

interface DropCompProps {
  title?: string;
  source: string;
  view: string;
  dragOver: boolean;
  handleOnDrop: (e: React.DragEvent, source?: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragOverStart: () => void;
  handleDragOverEnd: () => void;
}

export const DropComp = ({
  title,
  source,
  // view,
  dragOver,
  handleOnDrop,
  handleDragOver,
  handleDragOverEnd,
  handleDragOverStart,
}: DropCompProps) => {
  const { borderColor } = useCustomColors();
  return (
    <Box>
      {title && <Label label={title} />}
      <Box
        style={{
          // border: `0.2rem dashed ${
          //   dragOver
          //     ? "#0054A6"
          //     : `${theme.colorScheme === "dark" ? "#1f1f1f" : "#373A40"}`
          // } `,
          border: `3px dashed ${dragOver ? "#0054A6" : borderColor} `,
          // borderRadius: "0.25rem",
          borderRadius: "4px",
          padding: "1rem",
          // height: "200px",
          height: "143px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
        onDrop={(e) => handleOnDrop(e, source)}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOverStart}
        onDragLeave={handleDragOverEnd}
      >
        <Text size="sm" ta="center" lineClamp={2}>
          Drag & Drop a {source === "file Source" ? "file" : source}
        </Text>
        {/* <Text size="md" ta="center" lineClamp={2}>
          Drag & Drop a {source === "file Source" ? "File" : source} from {view}{" "}
          view
        </Text> */}
      </Box>
    </Box>
  );
};
