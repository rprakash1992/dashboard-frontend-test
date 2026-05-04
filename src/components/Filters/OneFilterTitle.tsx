import { Checkbox, Group, Text } from "@mantine/core";

interface OneFilterTitleProps {
  title: string;
  showCheckbox: boolean;
  checked?: boolean;
  onCheckboxClick?: (e: any) => void;
}

export const OneFilterTitle = ({
  title,
  showCheckbox,
  checked,
  onCheckboxClick,
}: OneFilterTitleProps) => (
  <Group align="center">
    {showCheckbox && (
      <Checkbox
        checked={checked}
        onClick={onCheckboxClick}
        onChange={onCheckboxClick}
        style={{ cursor: "pointer", marginRight: "5px" }}
      />
    )}
    <Text size="md">{title}</Text>
  </Group>
);
