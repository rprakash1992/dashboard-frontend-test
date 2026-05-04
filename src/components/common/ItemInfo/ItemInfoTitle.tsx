import { Box, Input } from "@mantine/core";

import { Label } from "../Label/Label";

export const ItemInfoTitle = ({
  title,
  loading,
  onChange,
  onBlur,
  onKeyDown,
}: {
  title: string;
  loading?: boolean;
  onChange: (val: string) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Box>
      <Label label="Title" />
      <Input
        placeholder="Enter title..."
        value={title}
        onChange={(e) => onChange(e.currentTarget.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        disabled={loading}
      />
    </Box>
  );
};
