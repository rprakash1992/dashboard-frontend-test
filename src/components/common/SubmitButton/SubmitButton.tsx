import { Button, Group } from "@mantine/core";

interface SubmitButtonProps {
  label: string;
  onSubmit: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const SubmitButton = ({
  label,
  onSubmit,
  isLoading,
  isDisabled,
}: SubmitButtonProps) => (
  <Group dir="row" justify="flex-end" align="center">
    <Button
      variant="default"
      onClick={onSubmit}
      disabled={isDisabled}
      loading={isLoading}
    >
      {label}
    </Button>
  </Group>
);
