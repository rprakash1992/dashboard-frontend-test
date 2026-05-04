import { Box, Skeleton } from "@mantine/core";
import { GridCardLayout } from "./GridItemCardLayout";
import type { ItemMetadataType } from "../../types";

export const SkeletonGridCard = () => {
  return (
    <GridCardLayout
      item={{} as ItemMetadataType}
      titleSection={<Skeleton h={20} w="60%" />}
      imageSection={<Skeleton height={116} />}
      topButtonsSection={<Skeleton h={20} w="30%" />}
      dateSection={
        <Box>
          <Skeleton height={10} mb={5} w="60%" />
          <Skeleton height={10} mb={20} w="60%" />
        </Box>
      }
      bottomButtonsSection={<Skeleton height={20} w="80%" />}
    />
  );
};
