import { Box, Group, Radio } from "@mantine/core";

import { Label } from "../../common/Label/Label";

interface EnumType {
  value: string;
  label: string;
}

interface TextBoxType {
  pt?: string;
  pb?: string;
  title?: string;
  value: string;
  enums: any[];
  onChange: (val: string) => void;
}

export const RadioGroup = ({
  pt,
  pb,
  title,
  enums,
  value,
  onChange,
}: TextBoxType) => {
  return (
    <Box pt={pt || "sm"} pb={pb || "sm"}>
      {title && <Label label={title} />}
      <Radio.Group value={value} onChange={onChange}>
        <Group>
          {enums.map(({ value: val, label }: EnumType) => (
            <Radio value={val} label={label} />
          ))}
        </Group>
      </Radio.Group>
    </Box>
  );
};
