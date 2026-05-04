import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Box, Input, Text } from "@mantine/core";

import { useStore } from "../../store";
import { VCSearchIcon } from "../../assets/icons";
import { generateUniqueId } from "../../utils/misc";
import { RouteItemTypesEnums } from "../../data/gui/RouteEnums";
import { AlertMsgType } from "../../store/actionSlice";

type SearchItemsProps = {
  width?: number;
};

export const SearchItems = ({ width }: SearchItemsProps) => {
  const viewProperties = useStore((state) => state.viewProperties);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const setViewPropertiesItem = useStore(
    (state) => state.setViewPropertiesItem,
  );
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      window.addEventListener("keydown", el1);

      searchInputRef.current.addEventListener("keyup", el2);
    }

    return () => {
      window.removeEventListener("keydown", el1);
      searchInputRef?.current?.removeEventListener("keyup", el2);
    };
  }, [searchInputRef]);

  const el1 = (e: any) => {
    if (e.ctrlKey && e.key === "m") {
      searchInputRef.current?.focus();
    }
  };

  const el2 = (e: any) => {
    if (e.key === "Escape") {
      searchInputRef.current?.blur();
    }
  };

  const handleSearch = async () => {
    // On perform search, data is filtered in frontend only. The new view will be created in frontend state and not saved in backend.
    // The view will disappear once the page is refreshed.

    if (searchText?.toLowerCase()?.trim() === "all") {
      // Don't allow creating a view with title 'all' as it is a default reserved title for each item type.
      return setDialogBoxMsg(
        `Cannot create a view with title '${searchText}'.`,
        AlertMsgType.ERROR,
      );
    }

    const itemType = RouteItemTypesEnums[pathname];

    if (!itemType) {
      return setDialogBoxMsg(
        "Search can be performed for 'Files', 'Projects', 'Reports', 'Workspaces', 'Users', 'Roles', 'Workflows', 'Jobs' only.",
        AlertMsgType.ERROR,
      );
    }

    const filters = {
      filterType: [
        {
          id: generateUniqueId(),
          filterTitle: "Title",
          operator: "Contains",
          value: searchText,
          isChecked: true,
        },
        {
          id: generateUniqueId(),
          filterTitle: "Parent Folder",
          operator: "Equals",
          value: null,
          isChecked: true,
        },
      ],
      groupedFilterType: [],
    };

    const newView = {
      id: generateUniqueId(),
      title: searchText,
      item_type: itemType,
      group_by: "created_date_descend",
      sort_by: "created_date_descend",
      filters: filters,
      view_as: "grid",
      status: "temporary",
    };

    setViewPropertiesItem([...viewProperties, newView]);
    setSearchText("");
    navigate(
      `${pathname}?tabId=${newView.id}&tabTitle=${searchText}&itemId=${newView.id}`,
    );
  };

  const onKeyUp = (e: any) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box>
      <Input
        ref={searchInputRef}
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        placeholder={"Search items..."}
        leftSection={<VCSearchIcon size={20} onClick={handleSearch} />}
        rightSection={
          <Text fw="bold" size="xs">
            CTRL + M
          </Text>
        }
        rightSectionWidth="65px"
        onKeyUp={onKeyUp}
        w={width ? `${width}px` : "100%"}
      />
    </Box>
  );
};
