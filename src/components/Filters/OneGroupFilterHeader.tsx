import { Group, Text, Tooltip } from "@mantine/core";

import { VCChevronDownIcon, VCEditIcon, VCTrashIcon } from "../../assets/icons";

export const OneGroupFilterHeader = ({
  title,
  onGroupClick,
  groupExpanded,
  onEditFilterGroupClick,
  deleteFilterGroup,
}: any) => (
  <Group
    align="center"
    justify="space-between"
    style={{ cursor: "pointer" }}
    onClick={onGroupClick}
  >
    <Group align="center" gap="xs">
      <VCChevronDownIcon
        size={20}
        style={{ rotate: groupExpanded ? "180deg" : "0deg" }}
      />
      <Text ml="5px">{title}</Text>
    </Group>
    <Group align="center" gap="xs">
      <Tooltip label="Edit">
        <VCEditIcon
          size={20}
          cursor="pointer"
          onClick={onEditFilterGroupClick}
        />
      </Tooltip>
      <Tooltip label="Delete">
        <VCTrashIcon size={20} cursor="pointer" onClick={deleteFilterGroup} />
      </Tooltip>
    </Group>
  </Group>
);
