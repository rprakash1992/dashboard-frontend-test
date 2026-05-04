import { Tooltip } from "@mantine/core";

import { VCCircleCheckIcon, VCCircleCheckFilledIcon } from "../../assets/icons";

type InfoPanelCheckBtnsProps = {
  isChecked?: boolean;
  onCheckIconClick?: (e: any) => void;
};

export const InfoPanelCheckBtns = ({
  isChecked,
  onCheckIconClick,
}: InfoPanelCheckBtnsProps) => {
  return (
    <Tooltip label="Select">
      {isChecked ? (
        <VCCircleCheckFilledIcon
          onClick={(e) => onCheckIconClick && onCheckIconClick(e)}
          size={26}
        />
      ) : (
        <VCCircleCheckIcon
          onClick={(e) => onCheckIconClick && onCheckIconClick(e)}
          size={26}
        />
      )}
    </Tooltip>
  );
};
