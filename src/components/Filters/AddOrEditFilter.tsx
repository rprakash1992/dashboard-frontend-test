import { useEffect, useState } from "react";
import { Box, Select, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import type { FilterItem, ViewItemPropertyType } from "../../store/viewSlice";
import {
  VCChevronDownIcon,
  VCCloseIcon,
  VCCalenderTimeIcon,
} from "../../assets/icons";
import { FilterBottomControls } from "./FilterBottomControls";

const filterTitlesForItems = [
  "Title",
  "Created Date",
  "Modified Date",
  // "Owner Name",
  "Category",
];

const filterTitlesForUsers = [
  "Name",
  "Created Date",
  "Modified Date",
  "Email",
  "Status",
  "Country",
  "Age",
];

const filterTitlesForWorkspaces = [
  "Title",
  "Created Date",
  "Modified Date",
  // "Owner Name",
  "Category",
];

const operators: any = {
  Name: ["Contains", "Matches", `Doesn't Contains`],
  Title: ["Contains", "Matches", `Doesn't Contains`],
  Category: ["Contains", "Matches", `Doesn't Contains`],
  "Owner Name": ["Contains", "Matches", `Doesn't Contains`],
  Email: ["Contains", "Matches", `Doesn't Contains`],
  Status: ["Equals", "Not Equals"],
  Country: ["Equals", "Not Equals"],
  Age: ["Greater than", "Less than", "Equals"],
  "Created Date": ["Earlier than", "Equals", "Later than", "Between"],
  "Modified Date": ["Earlier than", "Equals", "Later than", "Between"],
};

const values: any = {
  Status: ["Active", "Inactive", "Pending"],
  Country: ["us", "india"],
};

interface CurrentFilterItem extends FilterItem {
  dateValue: Date[];
}

interface AddEditFilterProps {
  activeView: ViewItemPropertyType;
  currentFilter: CurrentFilterItem;
  hideBottomControls?: boolean;
  setCurrentFilter: (filter: CurrentFilterItem) => void;
  onApplyFilterClick: () => void;
  cancelAddNewFilter: () => void;
  setIsDateRange?: (val: boolean) => void;
}

export const AddOrEditFilter = ({
  activeView,
  currentFilter,
  hideBottomControls,
  setCurrentFilter,
  onApplyFilterClick,
  cancelAddNewFilter,
}: AddEditFilterProps) => {
  const [filterTitles, setFilterTitles] = useState<string[]>([]);

  useEffect(() => {
    if (activeView?.item_type === "workspace") {
      setFilterTitles(filterTitlesForWorkspaces);
    } else if (activeView?.item_type === "user_profile") {
      setFilterTitles(filterTitlesForUsers);
    } else {
      setFilterTitles(filterTitlesForItems);
    }
  }, [activeView]);

  // const filterId = currentFilter.id;
  const filterTitle = currentFilter.filterTitle;
  const operator = currentFilter.operator;
  const value = currentFilter.value;
  const dateValue = currentFilter.dateValue;

  const onFilterTitleChange = (val: string) => {
    setCurrentFilter({
      ...currentFilter,
      filterTitle: val,
      operator: operators[val][0],
    });
  };

  const onOperatorChange = (val: string) => {
    setCurrentFilter({
      ...currentFilter,
      operator: val,
    });
  };

  const onValueChange = (val: string) => {
    setCurrentFilter({
      ...currentFilter,
      value: val,
    });
  };

  const onDateValueChange = (val: Date[]) => {
    setCurrentFilter({
      ...currentFilter,
      dateValue: val,
    });
  };

  const onApplyClick = () => {
    onApplyFilterClick();
  };

  return (
    <Box>
      <Select
        label="Filter Name"
        placeholder="Select Filter Name"
        checkIconPosition="right"
        value={filterTitle}
        data={filterTitles}
        rightSection={<VCChevronDownIcon size={20} />}
        onChange={(val) => onFilterTitleChange(val ?? "")}
      />
      <Select
        label="Operator"
        placeholder="Select Operator"
        checkIconPosition="right"
        value={operator}
        disabled={!filterTitle}
        data={operators[filterTitle]}
        rightSection={<VCChevronDownIcon size={20} />}
        onChange={(val) => onOperatorChange(val ?? "")}
      />
      {filterTitle === "Created Date" || filterTitle === "Modified Date" ? (
        <DateInput
          label={operator === "Between" ? "Start Date" : "Value"}
          valueFormat="DD-MM-YYYY"
          placeholder="Select Date"
          value={dateValue[0]}
          disabled={!operator}
          rightSection={<VCCalenderTimeIcon size={20} />}
          onChange={(val) => onDateValueChange([val as Date, dateValue[1]])}
        />
      ) : filterTitle === "Country" || filterTitle === "Status" ? (
        <Select
          label="Value"
          placeholder="Select Value"
          checkIconPosition="right"
          value={value}
          disabled={!operator}
          data={values[filterTitle]}
          rightSection={<VCChevronDownIcon size={20} />}
          onChange={(val) => onValueChange(val ?? "")}
        />
      ) : (
        <TextInput
          label="Value"
          rightSectionProps={<VCCloseIcon cursor={"pointer"} size={20} />}
          placeholder="Enter Value"
          value={value}
          rightSection={
            <VCCloseIcon
              size={20}
              cursor={"pointer"}
              onClick={() => onValueChange("")}
            />
          }
          disabled={!operator}
          onChange={(e) => onValueChange(e.target.value)}
        />
      )}
      {operator === "Between" && (
        <DateInput
          label="End Date"
          valueFormat="DD-MM-YYYY"
          placeholder="Select Date"
          value={dateValue[1]}
          rightSection={<VCCalenderTimeIcon size={20} />}
          onChange={(val) => onDateValueChange([dateValue[0], val as Date])}
          disabled={!operator}
          minDate={dateValue[0]}
        />
      )}
      {!hideBottomControls && (
        <Box mt="xs">
          <FilterBottomControls
            onApplyClick={onApplyClick}
            onCancelClick={cancelAddNewFilter}
          />
        </Box>
      )}
    </Box>
  );
};
