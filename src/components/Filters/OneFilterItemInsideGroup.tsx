import { useEffect, useState } from "react";
import { Box, Card } from "@mantine/core";
import type {
  FilterItem,
  GroupFilterItem,
  ViewItemPropertyType,
} from "../../store/viewSlice";
import { formatDateToString } from "../../utils/misc";
import { AddOrEditFilter } from "./AddOrEditFilter";
import { OneFilterHeader } from "./OneFilterHeader";

interface CurrentFilterItem extends FilterItem {
  dateValue: Date[];
}

interface CurrentGroupFilterItem extends GroupFilterItem {
  children: CurrentFilterItem[];
}

interface FilterCardProps {
  item: FilterItem;
  activeView: ViewItemPropertyType;
  showEditFilter: boolean;
  currentFilterGroup: CurrentGroupFilterItem;
  deleteFilterItem: () => void;
  setCurrentFilterGroup: (fg: CurrentGroupFilterItem) => void;
}

export const OneFilterItemInsideGroup = ({
  item,
  activeView,
  showEditFilter,
  currentFilterGroup,
  deleteFilterItem,
  setCurrentFilterGroup,
}: FilterCardProps) => {
  const [currentFilter, setCurrentFilter] = useState<CurrentFilterItem>();

  useEffect(() => {
    if (item.id) {
      let dv = [new Date(), new Date()];

      if (
        item.filterTitle === "Created Date" ||
        item.filterTitle === "Modified Date"
      ) {
        if (item.operator === "Between") {
          dv = [new Date(item.value[0]), new Date(item.value[1])];
        } else {
          dv = [new Date(item.value[0]), new Date()];
        }
      }

      setCurrentFilter({
        ...item,
        dateValue: dv,
      });
    }
  }, []);

  useEffect(() => {
    const currentFilterId = currentFilter?.id;
    if (currentFilterId) {
      const children = currentFilterGroup?.children;
      const updatedChildren = children?.map((c) =>
        c?.id === currentFilterId ? currentFilter : c,
      );
      setCurrentFilterGroup({
        ...currentFilterGroup,
        children: updatedChildren,
      });
    }
  }, [currentFilter]);

  // const getCurrentFilter = (currentFilter: CurrentFilterItem) => {
  //   let v: any = currentFilter.value;

  //   if (
  //     currentFilter.filterTitle === "Created Date" ||
  //     currentFilter.filterTitle === "Modified Date"
  //   ) {
  //     if (currentFilter.operator === "Between") {
  //       v = currentFilter.dateValue;
  //     } else {
  //       v = currentFilter.dateValue[0];
  //     }
  //   }

  //   const newFilter = {
  //     id: currentFilter.id,
  //     filterTitle: currentFilter.filterTitle,
  //     operator: currentFilter.operator,
  //     value: v,
  //     isChecked: true,
  //   };

  //   return newFilter;
  // };

  const getOperator = (operator: string) => {
    switch (operator) {
      case "Matches":
        return "=";
      case "Equals":
        return "=";
      case "Earlier than":
        return "<";
      case "Later than":
        return ">";
      case "Between":
        return "b/w";
      default:
        return operator;
    }
  };

  const getValue = (title: string, operator: string, value: any) => {
    if (title === "Created Date" || title === "Modified Date") {
      if (operator === "Between") {
        return `${formatDateToString(value[0])} - ${formatDateToString(
          value[1],
        )}`;
      }
      return formatDateToString(value);
    } else {
      return value;
    }
  };

  const cancelEditFilter = () => {};

  const onDeleteClick = (e: any) => {
    e.stopPropagation();
    deleteFilterItem();
  };

  return (
    <Card padding="xs" mb="xs" withBorder>
      <OneFilterHeader
        title={`${item.filterTitle} ${getOperator(item.operator)}
        ${getValue(item.filterTitle, item.operator, item.value)}`}
        showCheckbox={false}
        hideFilterEditBtn={true}
        hideFilterDeleteBtn={!showEditFilter}
        onDeleteClick={onDeleteClick}
      />
      {showEditFilter && currentFilter && (
        <Box mt="xs">
          <AddOrEditFilter
            activeView={activeView}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            onApplyFilterClick={() => {}}
            cancelAddNewFilter={cancelEditFilter}
            hideBottomControls={true}
          />
        </Box>
      )}
    </Card>
  );
};
