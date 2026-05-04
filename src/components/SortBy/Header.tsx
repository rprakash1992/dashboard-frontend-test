import { Box } from "@mantine/core";

import { ItemTitle } from "../common/ItemTitle/ItemTitle";
import { useCustomColors } from "../../customHooks/useCustomColors";

export const SortHeader = () => {
  const { borderColor } = useCustomColors();
  return (
    <Box
      style={{
        width: "100%",
        height: "40px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 10px",
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      <ItemTitle title="Sort" />
    </Box>
  );
};
