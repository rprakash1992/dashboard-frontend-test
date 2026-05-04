import type { ReactNode } from "react";
import { Box, Card, Flex } from "@mantine/core";
import { useCustomColors } from "../../customHooks/useCustomColors";
import { DragWrapper } from "../DragWrapper/DragWrapper";
import type { ItemMetadataType } from "../../types";
import { ItemTitle } from "../common/ItemCard/ItemTitle";

interface GridCardLayoutProps {
  item: ItemMetadataType;
  titleSection?: ReactNode;
  imageSection: ReactNode;
  topButtonsSection: ReactNode;
  dateSection: ReactNode;
  bottomButtonsSection: ReactNode;
}

export const GridCardLayout = ({
  item,
  titleSection,
  imageSection,
  topButtonsSection,
  dateSection,
  bottomButtonsSection,
}: GridCardLayoutProps) => {
  const { borderColor } = useCustomColors();
  const itemTitle = item.title;

  return (
    <Card
      shadow="sm"
      radius="sm"
      p="sm"
      maw={550}
      withBorder
      style={{
        overflow: "visible",
        borderColor,
      }}
    >
      <DragWrapper item={item}>
        <Flex align="center" gap="xs">
          <Box w="30%">{imageSection}</Box>
          <Box w="70%">
            <Box mb="sm">
              <Flex
                direction="row"
                justify="space-between"
                align="center"
                mb="xs"
              >
                {titleSection ?? <ItemTitle title={itemTitle} showTooltip />}
                {topButtonsSection}
              </Flex>
              {dateSection}
            </Box>
            {bottomButtonsSection}
          </Box>
        </Flex>
      </DragWrapper>
    </Card>
  );
};
