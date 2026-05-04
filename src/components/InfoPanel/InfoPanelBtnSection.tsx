import { Box, Tooltip } from "@mantine/core";
import { InfoPanelCheckBtns } from "./InfoPanelCheckBtns";

import { VCCloseIcon } from "../../assets/icons";

type InfoPanelBtnSectionProps = {
  showCrossIcon?: boolean;
  showCheckIcon?: boolean;
  isChecked?: boolean;
  onCrossIconClick?: (e: any) => void;
  onCheckIconClick?: (e: any) => void;
};

export const InfoPanelBtnSection = ({
  showCrossIcon,
  showCheckIcon,
  isChecked,
  onCrossIconClick,
  onCheckIconClick,
}: InfoPanelBtnSectionProps) => {
  return (
    <Box
      style={{
        width: "10%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showCrossIcon ? (
        <Tooltip label="Remove">
          <VCCloseIcon
            cursor={"pointer"}
            size={20}
            onClick={(e: any) => onCrossIconClick && onCrossIconClick(e)}
          />
        </Tooltip>
      ) : showCheckIcon ? (
        <InfoPanelCheckBtns
          isChecked={isChecked}
          onCheckIconClick={onCheckIconClick}
        />
      ) : (
        <div style={{ width: "100%" }} />
      )}
    </Box>
  );
};
