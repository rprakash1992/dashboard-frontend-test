import { Button, Group } from "@mantine/core";

interface FilterBottomControlsProps {
  onCancelClick: () => void;
  onApplyClick: () => void;
}

export const FilterBottomControls = ({
  onCancelClick,
  onApplyClick,
}: FilterBottomControlsProps) => {
  return (
    <Group align="center" justify="flex-end" gap="xs">
      <Button variant="subtle" color="gray" onClick={onCancelClick}>
        Cancel
      </Button>
      <Button variant="default" onClick={onApplyClick}>
        Apply
      </Button>
    </Group>
  );
};
