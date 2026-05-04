import React from "react";
import type { ArrayTranslations } from "@jsonforms/core";
import { ActionIcon, Box, Group } from "@mantine/core";

import { VCPlusIcon } from "../../../assets/icons";
import { Label } from "../../common/Label/Label";

export interface ArrayLayoutToolbarProps {
  label: string;
  description: string;
  errors: string;
  path: string;
  enabled: boolean;
  addItem(path: string, data: any): () => void;
  createDefault(): any;
  translations: ArrayTranslations;
}
export const ArrayLayoutToolbar = React.memo(function ArrayLayoutToolbar({
  label,
  addItem,
  path,
  createDefault,
}: ArrayLayoutToolbarProps) {
  return (
    <Box
      pt="xs"
      pb="xs"
      mt="sm"
    >
      <Group justify="space-between" align="center">
        <Label label={label} />
        <ActionIcon size={24} onClick={addItem(path, createDefault())}>
          <VCPlusIcon />
        </ActionIcon>
      </Group>
    </Box>
  );
});
