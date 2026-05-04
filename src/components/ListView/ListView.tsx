import { useMemo } from "react";
import { type MRT_ColumnDef } from "mantine-react-table";
import { Divider, Group, Text } from "@mantine/core";
import { ItemsTable } from "./ItemsTable";
import { getTimeLapsed } from "../../utils/misc";
import type { ItemMetadataType, TableColumnType, Job } from "../../types";
import { ItemButtonsBottom } from "../common/ItemCard/ItemButtonsBottom";
import { ItemButtonsTop } from "../common/ItemCard/ItemButtonsTop";
import { useStore } from "../../store";
import { LabelValue } from "../common/LabelValue/LabelValue";
import ItemUploadFailed from "../common/ItemCard/ItemUploadFailed";
import { useGetCardType } from "../../customHooks/useGetCardType";
import type { FileUploadDetail } from "../../store/fileSlice";
import { ItemProgress } from "../common/ItemCard/itemPercentageProgress";

interface TableActionCellProps {
  row: any;
  fileItems: any[];
  fileUploads: Record<string, FileUploadDetail>;
  runItems: Job[];
  jobItems: Job[];
  loadingExtractionsCompressions: string[];
  removeRunItem: (itemId: string) => void;
  handleCommentClick: (item: ItemMetadataType) => void;
  selectItemProperty: (
    item: ItemMetadataType,
    id: string,
    route: string,
    showCommentBox: boolean,
  ) => void;
  handleDeleteItem: (item: ItemMetadataType) => void;
  handleDownloadFile: (item: ItemMetadataType) => void;
  handleOpenItem: (item: ItemMetadataType) => void;
  handleCopyItem: (item: ItemMetadataType) => void;
  handleExtract: (itemId: string) => void;
  handleZipFile: (itemId: string) => void;
  runFlow: (itemId: string) => void;
  createFlow: (itemId: string) => void;
}

const TableActionCell = ({
  row,
  fileItems,
  fileUploads,
  runItems,
  jobItems,
  loadingExtractionsCompressions,
  removeRunItem,
  handleCommentClick,
  selectItemProperty,
  handleDeleteItem,
  handleDownloadFile,
  handleOpenItem,
  handleCopyItem,
  handleExtract,
  handleZipFile,
  runFlow,
  createFlow,
}: TableActionCellProps) => {
  const itemId = row?.original?.id;
  const itemType = row?.original?.item_type;
  const fileItem = fileItems.find((file) => file?.id === itemId);
  const fileExtension = fileItem?.mime_type ?? null;
  const fileUploadDetails = fileUploads[itemId];
  const runDetails = runItems.find((r) => r.output_item_id === itemId);
  const jobDetails = jobItems.find((j) => j.id === itemId) ?? null;

  const isZip = itemType === "file" && fileExtension === "zip";
  const isFlow = itemType === "file" && fileExtension === "workflow.zip";
  const isFolderItem = fileItems.find((file) => file?.parent === itemId);
  const isLoadingExtractionCompression =
    loadingExtractionsCompressions.includes(itemId);

  const cardType = useGetCardType(
    itemType,
    fileUploadDetails,
    runDetails,
    jobDetails,
  );

  if (cardType === "fileUploadFailed") {
    return <ItemUploadFailed itemId={itemId} fileExtension={fileExtension} />;
  }

  if (cardType === "fileUploadProgress") {
    return (
      <ItemProgress
        itemId={itemId}
        cardType="fileUploadProgress"
        onComplete={() => {}}
      />
    );
  }

  if (cardType === "fileExtraction") {
    return (
      <ItemProgress
        itemId={itemId}
        cardType="fileExtraction"
        onComplete={removeRunItem}
      />
    );
  }

  if (cardType === "fileCompression") {
    return (
      <ItemProgress
        itemId={itemId}
        cardType="fileCompression"
        onComplete={removeRunItem}
      />
    );
  }

  if (cardType === "jobProgress") {
    return (
      <ItemProgress
        itemId={itemId}
        cardType="jobProgress"
        onComplete={() => {}}
      />
    );
  }

  return (
    <Group>
      {(itemType === "file" || itemType === "workspace") && (
        <>
          <ItemButtonsBottom
            itemId={itemId}
            itemType={itemType}
            handleCommentClick={() => handleCommentClick(row?.original)}
            handlePropertyBtnClick={(prop: string, route: string) =>
              selectItemProperty(row?.original, prop, route, false)
            }
          />
          <Divider orientation="vertical" />
        </>
      )}
      <ItemButtonsTop
        itemId={itemId}
        itemType={itemType}
        isZip={isZip}
        isFolderItem={isFolderItem}
        isFlow={isFlow}
        isLoadingExtractionCompression={isLoadingExtractionCompression}
        fileExtension={fileExtension}
        handleDeleteItem={() => handleDeleteItem(row?.original)}
        handleDownloadFile={() => handleDownloadFile(row?.original)}
        handleOpenItem={() => handleOpenItem(row?.original)}
        handleCopyItem={() => handleCopyItem(row?.original)}
        handleExtract={() => handleExtract(itemId)}
        handleZipFile={() => handleZipFile(itemId)}
        runFlow={() => runFlow(itemId)}
        createFlow={() => createFlow(itemId)}
      />
    </Group>
  );
};

interface TableViewType {
  fileItems: any[];
  jobItems: Job[];
  runItems: Job[];
  removeRunItem: (itemId: string) => void;
  itemsToDisplay: any;
  loadingExtractionsCompressions: string[];
  handleDeleteItem: (item: ItemMetadataType) => void;
  handleCopyItem: (item: ItemMetadataType) => void;
  handleDownloadFile: (item: ItemMetadataType) => void;
  handleOpenItem: (item: ItemMetadataType) => void;
  selectItemProperty: (
    item: ItemMetadataType,
    id: string,
    route: string,
    showCommentBox: boolean,
  ) => void;
  handleCommentClick: (item: ItemMetadataType) => void;
  handleExtract: (itemId: string) => void;
  handleZipFile: (itemId: string) => void;
  runFlow: (itemId: string) => void;
  createFlow: (itemId: string) => void;
}

export const ListView = ({
  fileItems,
  jobItems,
  runItems,
  itemsToDisplay,
  loadingExtractionsCompressions,
  removeRunItem,
  handleDeleteItem,
  handleCopyItem,
  handleOpenItem,
  selectItemProperty,
  handleDownloadFile,
  handleCommentClick,
  handleExtract,
  handleZipFile,
  runFlow,
  createFlow,
}: TableViewType) => {
  const fileUploads = useStore((state) => state.fileUploads);

  const columns = useMemo<MRT_ColumnDef<TableColumnType>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Name",
        size: 180,
      },
      {
        accessorKey: "last_modified_at",
        header: "Last Modified",
        size: 100,
        Cell: ({ row, cell }) =>
          !row.original.children && (
            <LabelValue labelValue={getTimeLapsed(cell.getValue() as string)} />
          ),
      },
      {
        accessorKey: "created_at",
        header: "Created",
        size: 100,
        Cell: ({ row, cell }) =>
          !row.original.children && (
            <LabelValue labelValue={getTimeLapsed(cell.getValue() as string)} />
          ),
      },
      {
        id: "action_id",
        header: "Actions",
        size: 300,
        Cell: ({ row }) =>
          !row.original.children ? (
            <TableActionCell
              row={row}
              fileItems={fileItems}
              fileUploads={fileUploads}
              runItems={runItems}
              jobItems={jobItems}
              removeRunItem={removeRunItem}
              loadingExtractionsCompressions={loadingExtractionsCompressions}
              handleCommentClick={handleCommentClick}
              selectItemProperty={selectItemProperty}
              handleDeleteItem={handleDeleteItem}
              handleDownloadFile={handleDownloadFile}
              handleOpenItem={handleOpenItem}
              handleCopyItem={handleCopyItem}
              handleExtract={handleExtract}
              handleZipFile={handleZipFile}
              runFlow={runFlow}
              createFlow={createFlow}
            />
          ) : null,
      },
    ],
    [fileUploads, runItems, jobItems],
  );

  return itemsToDisplay?.length <= 0 ? (
    <Text ta="center">No items found</Text>
  ) : (
    <ItemsTable
      tableColumn={columns}
      tableData={itemsToDisplay as TableColumnType[]}
    />
  );
};
