import { Box, Tooltip } from "@mantine/core";

import { ItemTitle } from "../common/ItemTitle/ItemTitle";
import { useCustomColors } from "../../customHooks/useCustomColors";
import { VCPlusIcon, VCServerIcon } from "../../assets/icons";

interface HeaderProps {
  showAddGroupIcon: boolean;
  showAddFilterIcon: boolean;
  isGroupingFilters: boolean;
  onAddNewFilterClick: () => void;
  onCreateFilterGroupClick: () => void;
  cancelAddNewFilter: () => void;
}

export const Header = ({
  showAddGroupIcon,
  showAddFilterIcon,
  isGroupingFilters,
  onAddNewFilterClick,
  onCreateFilterGroupClick,
  cancelAddNewFilter,
}: HeaderProps) => {
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
      <ItemTitle title="Filters" />
      <Box style={{ display: "flex", justifyContent: "center" }}>
        {!isGroupingFilters && (
          <Tooltip label={showAddFilterIcon ? "Cancel" : "Add New Filter"}>
            <VCPlusIcon
              cursor={"pointer"}
              size={22}
              style={{
                rotate: showAddFilterIcon ? "45deg" : "0deg",
              }}
              onClick={
                showAddFilterIcon ? cancelAddNewFilter : onAddNewFilterClick
              }
            />
          </Tooltip>
        )}
        {showAddGroupIcon && !showAddFilterIcon && false &&(
          <Tooltip label="Group Filters">
            <VCServerIcon
              style={{ marginLeft: "10px" }}
              cursor={"pointer"}
              size={22}
              onClick={onCreateFilterGroupClick}
            />
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};
