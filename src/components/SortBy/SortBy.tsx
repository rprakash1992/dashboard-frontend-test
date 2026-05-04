import { useEffect, useState } from "react";
import { Box, Group, Text } from "@mantine/core";
import { useStore } from "../../store";
import { useViewActions } from "../../customHooks/useViewActions";
import type { ViewItemPropertyType } from "../../store/viewSlice";
import { SortByData } from "../../data/gui/SortByData";
import { VCCheckIcon } from "../../assets/icons";
import { SortHeader } from "./Header";
import { useCustomColors } from "../../customHooks/useCustomColors";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";

interface SortByProps {
  viewId: string;
}

const SortBy = ({ viewId }: SortByProps) => {
  const viewProperties = useStore((state) => state.viewProperties);
  const { applySort } = useViewActions();
  const [selectedSort, setSelectedSort] = useState<string>("");
  const { borderColor } = useCustomColors();

  useEffect(() => {
    const view = viewProperties.find(
      (view) => String(view.id) === String(viewId),
    ) as ViewItemPropertyType;

    setSelectedSort(view?.sort_by);
  }, [viewProperties]);

  const onClick = (sort: string) => {
    applySort(viewId, sort);
  };

  return (
    <MaxWidthContainer>
      <Box>
        <SortHeader />
        <Box p="10px">
          {SortByData.map((item) => (
            <Box
              key={item.id}
              style={{
                cursor: "pointer",
                padding: "10px 0",
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              <Text size="md">{item.name}:</Text>
              <Box pl="xs">
                {item.children.map((child) => (
                  <Group
                    key={child.id}
                    style={{ cursor: "pointer", height: "32px" }}
                    align="center"
                    justify="space-between"
                    onClick={() => onClick(child.id)}
                    gap="xs"
                  >
                    <Text size="sm">{child.name}</Text>
                    {selectedSort === child.id && <VCCheckIcon />}
                  </Group>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </MaxWidthContainer>
  );
};

export default SortBy;
