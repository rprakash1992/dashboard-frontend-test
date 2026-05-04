import { Box, Textarea } from "@mantine/core";

import { Label } from "../../common/Label/Label";

interface TextAreaBoxType {
  pt?: string;
  pb?: string;
  title?: string;
  value: string;
  elmRef?: any;
  rows?: number;
  disabled?: boolean;
  placeholder?: string;
  onChange: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
}

export const TextAreaBox = ({
  // pt,
  pb,
  title,
  value,
  elmRef,
  disabled,
  placeholder,
  onChange,
  onKeyDown,
  onBlur,
}: TextAreaBoxType) => {
  return (
    <Box
      // pt={pt || "sm"}
      pb={pb || "sm"}
    >
      {title && <Label label={title} />}
      <Textarea
        ref={elmRef}
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
      />
    </Box>
  );
};
