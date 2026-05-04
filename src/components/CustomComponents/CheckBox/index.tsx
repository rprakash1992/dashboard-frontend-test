import { Box, Checkbox } from "@mantine/core";

interface CheckBoxType {
  pt?: string;
  pb?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckBox = ({
  pt,
  pb,
  label,
  checked,
  onChange,
}: CheckBoxType) => {
  return (
    <Box pt={pt || "sm"} pb={pb || "sm"}>
      <Checkbox
        checked={checked}
        label={label}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
    </Box>
  );
};
