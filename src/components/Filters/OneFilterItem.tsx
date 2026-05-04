import { useEffect, useState } from "react";
import { Box, Card } from "@mantine/core";
import type {
  FilterItem,
  GroupFilterItem,
  ViewItemPropertyType,
} from "../../store/viewSlice";
import { formatDateToString } from "../../utils/misc";
import { AddOrEditFilter } from "./AddOrEditFilter";
import { useViewActions } from "../../customHooks/useViewActions";
import { OneFilterHeader } from "./OneFilterHeader";

interface CurrentFilterItem extends FilterItem {
  dateValue: Date[];
}

interface FilterCardProps {
  item: FilterItem;
  activeView: ViewItemPropertyType;
  isGroupingFilters?: boolean;
  showCheckbox: boolean;
  currentFilterGroup?: GroupFilterItem;
  deleteFilterItem: () => void;
  selectFilterToGroup: () => void;
}

export const OneFilterItem = ({
  item,
  activeView,
  isGroupingFilters,
  showCheckbox,
  currentFilterGroup,
  deleteFilterItem,
  selectFilterToGroup,
}: FilterCardProps) => {
  const { editFilter } = useViewActions();
  const [showEditFilter, setShowEditFilter] = useState<boolean>(false);
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
          dv = [new Date(item.value), new Date()];
        }
      }

      setCurrentFilter({
        ...item,
        dateValue: dv,
      });
    }
  }, []);

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

  const cancelEditFilter = () => {
    setShowEditFilter(false);
    setCurrentFilter({
      ...item,
      dateValue: Array.isArray(item.value)
        ? [new Date(item.value[0]), new Date(item.value[1])]
        : [new Date(item.value), new Date()],
    });
  };

  const onEditClick = () => {
    setShowEditFilter(true);
  };

  const onDeleteClick = (e: any) => {
    e.stopPropagation();
    deleteFilterItem();
  };

  const onCheckboxClick = (e: any) => {
    e.stopPropagation();
    selectFilterToGroup();
  };

  const onApplyFilterClick = () => {
    if (currentFilter) {
      let v: any = currentFilter.value;

      if (
        currentFilter.filterTitle === "Created Date" ||
        currentFilter.filterTitle === "Modified Date"
      ) {
        if (currentFilter.operator === "Between") {
          v = currentFilter.dateValue;
        } else {
          v = currentFilter.dateValue[0];
        }
      }

      const newFilter = {
        id: currentFilter.id,
        filterTitle: currentFilter.filterTitle,
        operator: currentFilter.operator,
        value: v,
        isChecked: true,
      };

      editFilter(activeView?.id, newFilter);
      cancelEditFilter();
    }
  };

  return (
    <Card padding="xs" mb="xs">
      <OneFilterHeader
        title={`${item.filterTitle} ${getOperator(item.operator)}
        ${getValue(item.filterTitle, item.operator, item.value)}`}
        checked={
          !!currentFilterGroup?.children?.find(
            (f) => String(f.id) === String(item.id),
          )
        }
        showCheckbox={showCheckbox}
        onCheckboxClick={onCheckboxClick}
        hideFilterEditBtn={isGroupingFilters}
        hideFilterDeleteBtn={isGroupingFilters}
        onDeleteClick={onDeleteClick}
        onEditClick={onEditClick}
      />
      {showEditFilter && currentFilter && (
        <Box mt="xs">
          <AddOrEditFilter
            activeView={activeView}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            onApplyFilterClick={onApplyFilterClick}
            cancelAddNewFilter={cancelEditFilter}
          />
        </Box>
      )}
    </Card>
  );
};
