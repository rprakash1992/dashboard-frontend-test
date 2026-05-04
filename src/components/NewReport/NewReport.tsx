import { useEffect, useState } from "react";
import { Box, Stack, Text, useMantineColorScheme } from "@mantine/core";
import { useLocation } from "react-router";

import classes from "./styles.module.css";
import { useStore } from "../../store";
import { AlertMsgType } from "../../store/actionSlice";
import { DropComp } from "../DropComp";
import { ItemTitle } from "../common/ItemTitle/ItemTitle";
import { SearchDropdown } from "../CustomComponents/SearchDropdown";
import { itemApi } from "../../apiActions/itemApi";
import { reportTemplate } from "./reportTemplate";
import { reportApi } from "../../apiActions/reportApi";
import { SubmitButton } from "../common/SubmitButton/SubmitButton";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { NewItemBase } from "../NewItemBase/NewItemBase";
import type { ItemMetadataType } from "../../types";

interface NewReportItemType {
  title: string;
  projectItem: ItemMetadataType;
  prevReportItem: ItemMetadataType;
}

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

const NewReport = () => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  // const addReloadComponent = useStore((state) => state.addReloadComponent);
  const setNewItemMetadata = useStore((state) => state.setNewItemMetadata);
  const [reportTitle, setReportTitle] = useState<string>("New Report");
  const [reportDesc, setReportDesc] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [newReportItem, setNewReportItem] = useState<NewReportItemType>({
    title: "New Report",
    projectItem: {},
    prevReportItem: {},
  } as NewReportItemType);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [projectSearchValue, setProjectSearchValue] = useState<string>("");
  const [reportSearchValue, setReportSearchValue] = useState<string>("");
  const [projectDropdownItems, setProjectDropdownItems] = useState<any[]>([]);
  const [reportDropdownItems, setReportDropdownItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setNewReportItem({
      title: "New Report",
      projectItem: {} as ItemMetadataType,
      prevReportItem: {} as ItemMetadataType,
    });
  }, []);

  useEffect(() => {
    setReportTitle(newReportItem.title);
  }, [pathname]);

  useEffect(() => {
    if (reportTitle !== newReportItem.title) {
      const timeOutId = setTimeout(
        () => setNewReportItem({ ...newReportItem, title: reportTitle }),
        500,
      );
      return () => clearTimeout(timeOutId);
    }
  }, [reportTitle]);

  // const handleTitleChange = (val: string) => {
  //   setReportTitle(val);
  // };

  const handleDragOverStart = (dragOverItemType: string) =>
    setDragOver(dragOverItemType);
  const handleDragOverEnd = () => setDragOver(null);

  const handleAddItem = async () => {
    if (!reportTitle) {
      return setDialogBoxMsg("Enter report title.", AlertMsgType.ERROR);
    }

    if (!newReportItem?.projectItem?.id) {
      return setDialogBoxMsg("Select a project.", AlertMsgType.ERROR);
    }

    setIsLoading(true);
    try {
      const selectedProjectId = newReportItem?.projectItem?.id;

      const { data, error: newReportErr } = await reportApi.insertReport(
        reportTitle,
        reportDesc,
        "",
        categories,
        selectedProjectId,
        JSON.stringify([reportTemplate]),
      );

      if (newReportErr) {
        return setDialogBoxMsg(String(newReportErr), AlertMsgType.ERROR);
      }

      // setNewReportItem({
      //   title: "New Report",
      //   projectItem: {},
      //   prevReportItem: {},
      // } as NewReportItemType);
      resetData();
      setDialogBoxMsg("Report added.", AlertMsgType.SUCCESS);
      setNewItemMetadata(data.item);
      // addReloadComponent("report");
    } catch (err) {
      setDialogBoxMsg(String(err), AlertMsgType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnDropProject = async (e: React.DragEvent, source?: string) => {
    if (source != "project") return;

    const item: ItemMetadataType = JSON.parse(
      e?.dataTransfer?.getData("dragItem"),
    );
    if (item.item_type != "project") return;
    selectProjectItem(item);
  };

  const handleOnDropReport = async (e: React.DragEvent, source?: string) => {
    if (source != "report") return;

    const item: ItemMetadataType = JSON.parse(
      e?.dataTransfer?.getData("dragItem"),
    );
    if (item.item_type != "report") return;
    selectReportItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleProjectSearch = async (val: string) => {
    setProjectSearchValue(val);
    if (!val) {
      setProjectDropdownItems([]);
      return;
    }

    const { data, error } = await itemApi.searchItems("project", val);

    if (error) {
      return setDialogBoxMsg(error, AlertMsgType.ERROR);
    }

    setProjectDropdownItems(data);
  };

  const selectProjectItem = (item: ItemMetadataType) => {
    setReportTitle(item?.title);
    setNewReportItem({
      ...newReportItem,
      projectItem: item as ItemMetadataType,
    });
  };

  const handleReportSearch = async (val: string) => {
    setReportSearchValue(val);
    if (!val) {
      setReportDropdownItems([]);
      return;
    }

    const { data, error } = await itemApi.searchItems("report", val);

    if (error) {
      return setDialogBoxMsg(error, AlertMsgType.ERROR);
    }

    setReportDropdownItems(data);
  };

  const selectReportItem = (item: ItemMetadataType) => {
    setNewReportItem({
      ...newReportItem,
      prevReportItem: item as ItemMetadataType,
    });
  };

  const resetData = () => {
    setNewReportItem({
      title: "New Report",
      projectItem: {},
      prevReportItem: {},
    } as NewReportItemType);
    setReportTitle("");
    setReportDesc("");
    setCategories([]);
  };

  return (
    <MaxWidthContainer>
      <Stack p="xs" gap="xs">
        {/* <TextBox
          pt="0px"
          title="Title"
          value={reportTitle}
          onChange={handleTitleChange}
        /> */}
        <Box>
          <SearchDropdown
            pb="0px"
            title="Project"
            value={projectSearchValue}
            placeholder="Search Project..."
            dropdownItems={projectDropdownItems}
            DropdownItemComponent={DropdownItemComponent}
            NotFoundComponent={NotFoundComponent}
            onChange={handleProjectSearch}
            onSelect={selectProjectItem}
          />
          <Text ta="center" p="xs">
            OR
          </Text>
          <DropComp
            source="project"
            view="projects"
            dragOver={dragOver === "project"}
            handleDragOver={handleDragOver}
            handleDragOverEnd={handleDragOverEnd}
            handleDragOverStart={() => handleDragOverStart("project")}
            handleOnDrop={handleOnDropProject}
          />
          {newReportItem.projectItem?.id && (
            <Box p="xs" pb={0} pl={0}>
              <ItemTitle
                title={`Selected Project: ${newReportItem.projectItem?.title}`}
              />
            </Box>
          )}
        </Box>
        <Box>
          <SearchDropdown
            pb="0px"
            title="Report"
            value={reportSearchValue}
            placeholder="Search Report..."
            dropdownItems={reportDropdownItems}
            DropdownItemComponent={DropdownItemComponent}
            NotFoundComponent={NotFoundComponent}
            onChange={handleReportSearch}
            onSelect={selectReportItem}
          />
          <Text ta="center" p="xs">
            OR
          </Text>
          <DropComp
            source="report"
            view="reports"
            dragOver={dragOver === "report"}
            handleDragOver={handleDragOver}
            handleDragOverEnd={handleDragOverEnd}
            handleDragOverStart={() => handleDragOverStart("report")}
            handleOnDrop={handleOnDropReport}
          />
          {newReportItem.prevReportItem?.id && (
            <Box p="sm" pb={0} pl={0}>
              <ItemTitle
                title={`Selected Report: ${newReportItem.prevReportItem?.title}`}
              />
            </Box>
          )}
        </Box>
        <NewItemBase
          itemTitle={reportTitle}
          itemDescription={reportDesc}
          categories={categories}
          setItemTitle={setReportTitle}
          setItemDescription={setReportDesc}
          setCategories={async (tags) => setCategories(tags)}
        />
        <SubmitButton
          label="Add"
          onSubmit={handleAddItem}
          isLoading={isLoading}
        />
      </Stack>
    </MaxWidthContainer>
  );
};

export default NewReport;
