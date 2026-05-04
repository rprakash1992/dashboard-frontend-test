import { useEffect, useState } from "react";
import { Box, Card } from "@mantine/core";
import type {
  FilterItem,
  GroupFilterItem,
  ViewItemPropertyType,
} from "../../store/viewSlice";
import { OneFilterItemInsideGroup } from "./OneFilterItemInsideGroup";
import { GroupDetails } from "./GroupDetails";
import { useViewActions } from "../../customHooks/useViewActions";
import { FilterBottomControls } from "./FilterBottomControls";
import { OneGroupFilterHeader } from "./OneGroupFilterHeader";

interface OneGroupFilterItemProps {
  item: GroupFilterItem;
  activeView: ViewItemPropertyType;
  deleteFilterGroup: () => void;
}

interface CurrentFilterItem extends FilterItem {
  dateValue: Date[];
}

interface CurrentGroupFilterItem extends GroupFilterItem {
  children: CurrentFilterItem[];
}

export const OneGroupFilterItem = ({
  item,
  activeView,
  deleteFilterGroup,
}: OneGroupFilterItemProps) => {
  const { applyFilterGroup } = useViewActions();
  const [currentFilterGroup, setCurrentFilterGroup] =
    useState<CurrentGroupFilterItem>();
  const [groupExpanded, setGroupExpanded] = useState<boolean>(false);
  const [isEditingFilterGroup, setIsEditingFilterGroup] =
    useState<boolean>(false);

  useEffect(() => {
    if (item.id) {
      const children = item.children;
      const updatedChildren: CurrentFilterItem[] = [];

      children.forEach((child) => {
        let dv = [new Date(), new Date()];

        if (
          child.filterTitle === "Created Date" ||
          child.filterTitle === "Modified Date"
        ) {
          if (child.operator === "Between") {
            dv = [new Date(child.value[0]), new Date(child.value[1])];
          } else {
            dv = [new Date(child.value[0]), new Date()];
          }
        }

        const newChild = {
          ...child,
          dateValue: dv,
        };

        updatedChildren.push(newChild);
      });

      setCurrentFilterGroup({
        ...item,
        children: updatedChildren,
      });
    }
  }, [item]);

  const onGroupClick = () => {
    setGroupExpanded(!groupExpanded);
  };

  const onEditFilterGroupClick = (e: any) => {
    e.stopPropagation();
    setIsEditingFilterGroup(true);
    setGroupExpanded(true);
  };

  const onDeleteFilterClick = (filterId: string) => {
    if (currentFilterGroup?.id) {
      const children = currentFilterGroup?.children;
      const updatedChildren = children?.filter(
        (f) => String(f?.id) !== String(filterId),
      );

      setCurrentFilterGroup({
        ...currentFilterGroup,
        children: updatedChildren,
      });
    }
  };

  const setGroupTitle = (val: string) => {
    if (currentFilterGroup?.id) {
      setCurrentFilterGroup({
        ...currentFilterGroup,
        filterTitle: val,
      });
    }
  };

  const setGroupOperator = (val: string) => {
    if (currentFilterGroup?.id) {
      setCurrentFilterGroup({
        ...currentFilterGroup,
        groupOperator: val,
      });
    }
  };

  const onCancelEditFilterGroup = () => {
    const children = item.children;
    const updatedChildren: CurrentFilterItem[] = [];

    children.forEach((child) => {
      let dv = [new Date(), new Date()];

      if (
        child.filterTitle === "Created Date" ||
        child.filterTitle === "Modified Date"
      ) {
        if (child.operator === "Between") {
          dv = [new Date(child.value[0]), new Date(child.value[1])];
        } else {
          dv = [new Date(child.value[0]), new Date()];
        }
      }

      const newChild = {
        ...child,
        dateValue: dv,
      };

      updatedChildren.push(newChild);
    });

    setCurrentFilterGroup({
      ...item,
      children: updatedChildren,
    });
    setIsEditingFilterGroup(false);
  };

  const onApplyClick = () => {
    if (currentFilterGroup?.id) {
      const children = currentFilterGroup?.children;

      const updatedChildren: FilterItem[] = [];

      children?.forEach((child) => {
        let v: any = child.value;

        if (
          child.filterTitle === "Created Date" ||
          child.filterTitle === "Modified Date"
        ) {
          if (child.operator === "Between") {
            v = child.dateValue;
          } else {
            v = child.dateValue[0];
          }
        }

        const newChild = {
          id: child.id,
          filterTitle: child.filterTitle,
          operator: child.operator,
          value: v,
          isChecked: true,
        };

        updatedChildren.push(newChild);
      });
      applyFilterGroup(activeView?.id, {
        ...currentFilterGroup,
        children: updatedChildren,
      });
      setIsEditingFilterGroup(false);
    }
  };

  return (
    <Card padding="xs" mb="xs">
      <OneGroupFilterHeader
        title={`${item?.filterTitle} (
          ${item?.groupOperator})`}
        onGroupClick={onGroupClick}
        groupExpanded={groupExpanded}
        onEditFilterGroupClick={onEditFilterGroupClick}
        deleteFilterGroup={deleteFilterGroup}
      />
      {groupExpanded && currentFilterGroup && (
        <Box mt="xs">
          {isEditingFilterGroup && (
            <GroupDetails
              groupTitle={currentFilterGroup?.filterTitle}
              groupOperator={currentFilterGroup?.groupOperator}
              setGroupTitle={setGroupTitle}
              setGroupOperator={setGroupOperator}
            />
          )}
          {currentFilterGroup?.children?.length > 0 &&
            currentFilterGroup?.children.map((f: FilterItem) => (
              <OneFilterItemInsideGroup
                key={f.id}
                // item={f}
                item={item.children.find((child) => child.id === f.id)!}
                currentFilterGroup={currentFilterGroup}
                activeView={activeView}
                showEditFilter={isEditingFilterGroup}
                deleteFilterItem={() => onDeleteFilterClick(f?.id)}
                setCurrentFilterGroup={setCurrentFilterGroup}
              />
            ))}
          {isEditingFilterGroup && (
            <FilterBottomControls
              onCancelClick={onCancelEditFilterGroup}
              onApplyClick={onApplyClick}
            />
          )}
        </Box>
      )}
    </Card>
  );
};
