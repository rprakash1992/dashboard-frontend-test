import { Box, Textarea } from "@mantine/core";

import { Label } from "../Label/Label";
import { forwardRef } from "react";

export const ItemInfoDescription = forwardRef(
  (
    {
      value,
      rows,
      disabled,
      onChange,
      onKeyDown,
      onBlur,
    }: {
      value: string;
      rows?: number;
      disabled?: boolean;
      onChange: (val: string) => void;
      onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
      onBlur?: () => void;
    },
    ref: React.Ref<HTMLTextAreaElement>
  ) => {
    return (
      <Box>
        <Label label="Description" />
        <Textarea
          placeholder="Enter description..."
          ref={ref}
          rows={rows ?? 6}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.currentTarget.value)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
      </Box>
    );
  }
);
