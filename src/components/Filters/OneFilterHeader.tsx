import { Group, Tooltip } from "@mantine/core";

import { OneFilterTitle } from "./OneFilterTitle";
import { VCEditIcon, VCTrashIcon } from "../../assets/icons";

interface OneFilterHeaderProps {
  title: string;
  showCheckbox: boolean;
  checked?: boolean;
  hideFilterEditBtn?: boolean;
  hideFilterDeleteBtn?: boolean;
  onCheckboxClick?: (e: any) => void;
  onDeleteClick?: (e: any) => void;
  onEditClick?: () => void;
}

export const OneFilterHeader = ({
  title,
  checked,
  showCheckbox,
  hideFilterEditBtn,
  hideFilterDeleteBtn,
  onCheckboxClick,
  onDeleteClick,
  onEditClick,
}: OneFilterHeaderProps) => {
  return (
    <Group align="center" justify="space-between">
      <OneFilterTitle
        title={title}
        showCheckbox={showCheckbox}
        checked={checked}
        onCheckboxClick={onCheckboxClick}
      />
      <Group align="center" gap="xs">
        {!hideFilterEditBtn && (
          <Tooltip label="Edit">
            <VCEditIcon cursor="pointer" size={20} onClick={onEditClick} />
          </Tooltip>
        )}
        {!hideFilterDeleteBtn && (
          <Tooltip label="Delete">
            <VCTrashIcon cursor="pointer" size={20} onClick={onDeleteClick} />
          </Tooltip>
        )}
      </Group>
    </Group>
  );
};
