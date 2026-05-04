import { useEffect, useState } from "react";
import { Box, Text, useMantineColorScheme } from "@mantine/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import type { ControlProps, JsonSchema } from "@jsonforms/core";
import { SearchDropdown } from "../../CustomComponents/SearchDropdown";
import { DropComp } from "../../DropComp";
import { useStore } from "../../../store";
import type { ItemMetadataType } from "../../../types";
import classes from "./styles.module.css";
import { itemApi } from "../../../apiActions/itemApi";
import { AlertMsgType } from "../../../store/actionSlice";

type JsonSchemaWithMyProp = JsonSchema & { sourceType: string };

const sourceEnums: any = {
  file: "file Source",
  model: "model",
  report: "report",
};

const DropdownItemComponent = ({ item }: any) => {
  const { colorScheme } = useMantineColorScheme();
  return (
    <Text
      className={
        colorScheme === "dark"
          ? classes.searchBoxDropdownItemDark
          : classes.searchBoxDropdownItemLight
      }
    >
      {item.title}
    </Text>
  );
};

const NotFoundComponent = () => (
  <Text className={classes.searchBoxDropdownItem}>Not found</Text>
);

const SearchingComponent = () => (
  <Text className={classes.searchBoxDropdownItem}>Searching...</Text>
);

const SearchOrDropControl = (props: ControlProps) => {
  // const selectedWorkspace = useStore((state) => state.selectedWorkspace);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [searchValue, setSearchValue] = useState<string>("");
  const [dropdownItems, setDropdownItems] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState(false);
  const [itemTitle, setItemTitle] = useState<string>("");

  const { handleChange, path, data } = props;
  const schema = props.schema as JsonSchemaWithMyProp;
  const { sourceType, title } = schema;

  useEffect(() => {
    setItemTitle(data?.title);
  }, [data]);

  const handleSearch = async (val: string) => {
    setSearchValue(val);
    if (!val) {
      setIsSearching(false);
      return setDropdownItems([]);
    }

    setIsSearching(true);
    try {
      const { data, error } = await itemApi.searchItems("file", val);

      if (error) {
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      setDropdownItems(data);
    } finally {
      setIsSearching(false);
    }
  };

  const selectItem = (item: ItemMetadataType) => {
    handleChange(path, { title: item?.title, id: String(item?.id), item });
  };

  const handleDragOverStart = () => setDragOver(true);

  const handleDragOverEnd = () => setDragOver(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleOnDrop = (e: React.DragEvent) => {
    const dragItem = e.dataTransfer.getData("dragItem");
    const item: ItemMetadataType = JSON.parse(dragItem);

    setDragOver(false);
    if (item.item_type != "file") return;

    selectItem(item);
    // handleChange(path, item);
  };

  return (
    <Box pb="sm">
      <SearchDropdown
        // pb="0px"
        title={title}
        value={searchValue}
        placeholder="Search File Source..."
        dropdownItems={dropdownItems}
        DropdownItemComponent={DropdownItemComponent}
        NotFoundComponent={isSearching ? SearchingComponent : NotFoundComponent}
        onChange={handleSearch}
        onSelect={selectItem}
      />
      <Text ta="center" p="xs">
        OR
      </Text>
      <DropComp
        source={sourceEnums[sourceType]}
        view="Files"
        dragOver={dragOver}
        handleDragOver={handleDragOver}
        handleDragOverEnd={handleDragOverEnd}
        handleDragOverStart={handleDragOverStart}
        handleOnDrop={handleOnDrop}
      />
      {sourceType === "file" && itemTitle ? (
        <Text pt="xs" pb="xs">
          Selected File: {itemTitle}
        </Text>
      ) : null}
      {sourceType === "project" && itemTitle ? (
        <Text pt="xs" pb="xs">
          Selected Project: {itemTitle}
        </Text>
      ) : null}
      {sourceType === "report" && itemTitle ? (
        <Text pt="xs" pb="xs">
          Selected Report: {itemTitle}
        </Text>
      ) : null}
    </Box>
  );
};

export default withJsonFormsControlProps(SearchOrDropControl);
