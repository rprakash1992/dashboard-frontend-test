import { Box, Input } from "@mantine/core";

import { Label } from "../../common/Label/Label";

interface TextBoxType {
  pt?: string;
  pb?: string;
  title?: string;
  value: string;
  type?: string;
  elmRef?: any;
  disabled?: boolean;
  placeholder?: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const TextBox = ({
  // pt,
  pb,
  title,
  value,
  elmRef,
  type,
  disabled,
  placeholder,
  onChange,
  onBlur,
  onKeyDown,
}: TextBoxType) => {
  return (
    <Box
      // pt={pt || "sm"}
      pb={pb || "sm"}
    >
      {title && <Label label={title} />}
      <Input
        type={type || "text"}
        ref={elmRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        disabled={disabled}
        placeholder={placeholder}
      />
    </Box>
  );
};
