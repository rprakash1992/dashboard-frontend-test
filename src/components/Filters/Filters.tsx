import { useEffect, useState } from "react";
import { Box } from "@mantine/core";
import { useStore } from "../../store";
import { useViewActions } from "../../customHooks/useViewActions";
import type {
  FilterItem,
  GroupFilterItem,
  ViewItemPropertyType,
} from "../../store/viewSlice";
import { Header } from "./Header";
import { OneFilterItem } from "./OneFilterItem";
import { GroupDetails } from "./GroupDetails";
import { OneGroupFilterItem } from "./OneGroupFilterItem";
import { AddOrEditFilter } from "./AddOrEditFilter";
import { FilterBottomControls } from "./FilterBottomControls";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { AlertMsgType } from "../../store/actionSlice";

interface FiltersProps {
  viewId: string;
}

interface CurrentFilterItem extends FilterItem {
  dateValue: Date[];
}

const hiddenFilters = ["Parent Folder", "Upload Status", "Workflows"];

const Filters = ({ viewId }: FiltersProps) => {
  const viewProperties = useStore((state) => state.viewProperties);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const { addNewFilter, deleteFilter, deleteFilterGroup, applyFilterGroup } =
    useViewActions();
  const [showAddFilter, setShowAddFilter] = useState<boolean>(false);
  const [isGroupingFilters, setIsGroupingFilters] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ViewItemPropertyType>(
    {} as ViewItemPropertyType,
  );
  const [currentFilterGroup, setCurrentFilterGroup] = useState<GroupFilterItem>(
    {
      id: "",
      filterTitle: "",
      operator: "",
      children: [],
      isChecked: true,
      groupOperator: "All",
    },
  );
  const [currentFilter, setCurrentFilter] = useState<CurrentFilterItem>({
    id: "",
    filterTitle: "",
    operator: "",
    value: "",
    dateValue: [new Date(), new Date()],
    isChecked: true,
  });

  const activeFilterItems = activeView?.filters?.filterType;
  const visibleActiveFilterItems = activeFilterItems?.filter(
    (f) => !hiddenFilters.includes(f.filterTitle),
  );
  const activeGroupFilterItems = activeView?.filters?.groupedFilterType;

  useEffect(() => {
    setActiveView(
      viewProperties.find(
        (v) => String(v.id) === String(viewId),
      ) as ViewItemPropertyType,
    );
  }, [viewProperties]);

  const onAddNewFilterClick = () => {
    setShowAddFilter(true);
  };

  const cancelAddNewFilter = () => {
    setShowAddFilter(false);
    setCurrentFilter({
      id: "",
      filterTitle: "",
      operator: "",
      value: "",
      dateValue: [new Date(), new Date()],
      isChecked: true,
    });
  };

  const selectFilterToGroup = (f: FilterItem) => {
    // const isPresent = selectedGroupFilters.find(
    //   (v) => String(v.id) === String(f.id)
    // );

    // const updated = isPresent
    //   ? selectedGroupFilters.filter((v) => String(v.id) !== String(f.id))
    //   : [...selectedGroupFilters, f];
    // setSelectedGroupFilters(updated);

    const children = currentFilterGroup?.children;

    const isPresent = children.find((v) => String(v.id) === String(f.id));

    const updated = isPresent
      ? children.filter((v) => String(v.id) !== String(f.id))
      : [...children, f];

    setCurrentFilterGroup({
      ...currentFilterGroup,
      children: updated,
    });
  };

  const setGroupTitle = (val: string) => {
    setCurrentFilterGroup({
      ...currentFilterGroup,
      filterTitle: val,
    });
  };

  const setGroupOperator = (val: string) => {
    setCurrentFilterGroup({
      ...currentFilterGroup,
      groupOperator: val,
    });
  };

  const cancelAddGroupClick = () => {
    setCurrentFilterGroup({
      id: "",
      filterTitle: "",
      operator: "",
      children: [],
      isChecked: true,
      groupOperator: "All",
    });
    setIsGroupingFilters(false);
  };

  const applyAddGroupClick = () => {
    applyFilterGroup(viewId, currentFilterGroup);
    setIsGroupingFilters(false);
  };

  const onApplyFilterClick = () => {
    if (!currentFilter.filterTitle) {
      return setDialogBoxMsg("Select Filter title.", AlertMsgType.ERROR);
    }
    if (!currentFilter.operator) {
      return setDialogBoxMsg("Select Filter operator.", AlertMsgType.ERROR);
    }
    if (
      currentFilter.filterTitle === "Created Date" ||
      currentFilter.filterTitle === "Modified Date"
    ) {
      if (!currentFilter.dateValue[0]) {
        return setDialogBoxMsg("Select starting date.", AlertMsgType.ERROR);
      }
      if (currentFilter.operator === "Between" && !currentFilter.dateValue[1]) {
        return setDialogBoxMsg("Select ending date.", AlertMsgType.ERROR);
      }
    } else {
      if (!currentFilter.value) {
        return setDialogBoxMsg("Enter Filter value.", AlertMsgType.ERROR);
      }
    }

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
      filterTitle: currentFilter.filterTitle,
      operator: currentFilter.operator,
      value: v,
      isChecked: true,
    };

    addNewFilter(activeView?.id, newFilter);
    cancelAddNewFilter();
  };

  return (
    <MaxWidthContainer>
      {activeView?.id ? (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Header
            showAddGroupIcon={activeView?.filters?.filterType.length > 2}
            showAddFilterIcon={showAddFilter}
            isGroupingFilters={isGroupingFilters}
            onAddNewFilterClick={onAddNewFilterClick}
            onCreateFilterGroupClick={() => setIsGroupingFilters(true)}
            cancelAddNewFilter={cancelAddNewFilter}
          />
          <Box p="10px">
            {isGroupingFilters && (
              <GroupDetails
                groupTitle={currentFilterGroup?.filterTitle}
                groupOperator={currentFilterGroup?.groupOperator}
                setGroupTitle={setGroupTitle}
                setGroupOperator={setGroupOperator}
              />
            )}
            {showAddFilter && currentFilter && (
              <Box mb="xs">
                <AddOrEditFilter
                  activeView={activeView}
                  currentFilter={currentFilter}
                  setCurrentFilter={setCurrentFilter}
                  onApplyFilterClick={onApplyFilterClick}
                  cancelAddNewFilter={cancelAddNewFilter}
                />
              </Box>
            )}
            {visibleActiveFilterItems?.length > 0 &&
              visibleActiveFilterItems?.map((fi: FilterItem) => (
                <OneFilterItem
                  key={fi.id}
                  item={fi}
                  activeView={activeView}
                  isGroupingFilters={isGroupingFilters}
                  // selectedGroupFilters={selectedGroupFilters}
                  showCheckbox={isGroupingFilters}
                  currentFilterGroup={currentFilterGroup}
                  selectFilterToGroup={() => selectFilterToGroup(fi)}
                  deleteFilterItem={() => deleteFilter(activeView?.id, fi?.id)}
                />
              ))}
            {isGroupingFilters && (
              <FilterBottomControls
                onCancelClick={cancelAddGroupClick}
                onApplyClick={applyAddGroupClick}
              />
            )}
            {activeGroupFilterItems?.length > 0 &&
              activeGroupFilterItems?.map((fg: GroupFilterItem) => (
                <OneGroupFilterItem
                  key={fg.id}
                  item={fg}
                  activeView={activeView}
                  deleteFilterGroup={() =>
                    deleteFilterGroup(activeView?.id, fg?.id)
                  }
                />
              ))}
          </Box>
        </Box>
      ) : null}
    </MaxWidthContainer>
  );
};

export default Filters;
