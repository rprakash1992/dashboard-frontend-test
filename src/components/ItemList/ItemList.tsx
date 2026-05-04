import { useId } from "react";
import { Box, Text } from "@mantine/core";
import { ListView as TableView } from "../ListView/ListView";
import { GridView } from "../GridView";
import type { ItemMetadataType } from "../../types";
import type { ViewItemPropertyType } from "../../store/viewSlice";
import { ViewActionsPanel } from "../ViewActionsPanel/ViewActionsPanel";
import { ErrorComponent } from "../ErrorComponent/ErrorComponent";
import { DropWrapper } from "../DropWrapper";
import { useItemListData } from "../../customHooks/useItemListData";
import { useItemActions } from "../../customHooks/useItemActions";
import { useFileOperations } from "../../customHooks/useFileOperations";
import { useItemDragDrop } from "../../customHooks/useItemDragDrop";

type ItemsListProps = {
  viewId: string;
};

const ItemList = ({ viewId }: ItemsListProps) => {
  const randomId = useId();

  const {
    activeView,
    activeViewAs,
    itemsToDisplay,
    itemsMetadata,
    fileItems,
    jobItems,
    runItems,
    viewsBreadcrum,
    loadingDashboardItems,
    errorState,
    setActiveView,
    setViewsBreadcrum,
    setItemMetadata,
    setFileItems,
    setRunItems,
    removeRunItem,
  } = useItemListData(viewId);

  const {
    handleCopyItem,
    handleDeleteItem,
    handleDownloadFile,
    handleOpenItem,
    selectItemProperty,
    handleCommentClick,
  } = useItemActions(fileItems);

  const {
    loadingExtractionsCompressions,
    handleExtract,
    handleZipFile,
    runFlow,
    createFlow,
  } = useFileOperations(setItemMetadata, setFileItems, setRunItems);

  const {
    dragOver,
    handleDragOver,
    handleDragOverStart,
    handleDragOverEnd,
    handleOnDropFile,
  } = useItemDragDrop(
    activeView,
    itemsMetadata,
    fileItems,
    setItemMetadata,
    setFileItems,
  );

  const handleOpenItemWithFolder = async (item: ItemMetadataType) => {
    if (item.item_type === "file") {
      const isFolderItem = fileItems.find((file) => file.parent === item.id);

      if (isFolderItem) {
        const filters = {
          filterType: [
            {
              id: randomId,
              filterTitle: "Parent Folder",
              operator: "Equals",
              value: String(item.id),
              isChecked: true,
            },
          ],
          groupedFilterType: [],
        };

        const newView = {
          id: `folder-${item.id}`,
          title: item.title,
          item_type: "file",
          group_by: "created_date_descend",
          sort_by: "created_date_descend",
          filters: filters,
          view_as: "grid",
          status: "temporary",
        };

        setActiveView(newView);
        setViewsBreadcrum([...viewsBreadcrum, newView]);
        return;
      }
    }

    handleOpenItem(item);
  };

  const viewProps = {
    fileItems,
    jobItems,
    runItems,
    itemsToDisplay,
    loadingExtractionsCompressions,
    loadingDashboardItems,
    removeRunItem,
    handleDeleteItem,
    handleOpenItem: handleOpenItemWithFolder,
    selectItemProperty,
    handleDownloadFile,
    handleCommentClick,
    handleCopyItem,
    handleExtract,
    handleZipFile,
    runFlow,
    createFlow,
  };

  if (errorState) return <ErrorComponent />;

  return (
    <DropWrapper
      source="file"
      dragOver={dragOver === "file"}
      handleOnDrop={handleOnDropFile}
      handleDragOver={(e) => handleDragOver(e, "file")}
      handleDragOverEnd={handleDragOverEnd}
      handleDragOverStart={() => handleDragOverStart("file")}
    >
      <Box>
        <ViewActionsPanel
          activeView={activeView as ViewItemPropertyType}
          viewsBreadcrum={viewsBreadcrum}
          setActiveView={setActiveView}
          setViewsBreadcrum={setViewsBreadcrum}
        />
        {!loadingDashboardItems && itemsToDisplay?.length <= 0 ? (
          <Text ta="center">No items found</Text>
        ) : activeViewAs === "table" ? (
          <TableView {...viewProps} />
        ) : (
          <GridView {...viewProps} />
        )}
      </Box>
    </DropWrapper>
  );
};

export default ItemList;
