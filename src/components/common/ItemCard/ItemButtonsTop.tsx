import { Flex } from "@mantine/core";
import { IconFolderOpen } from "@tabler/icons-react";
import {
  VCDownloadIcon,
  VCFileZipIcon,
  VCJobsIcon,
  VCOpenIcon,
  VCTrashIcon,
  VCWorkflowIcon,
  // VCCopyIcon
} from "../../../assets/icons";
import { IconRenderer } from "../../IconRenderer/IconRenderer";
import { useStore } from "../../../store";

export interface ItemButtonsTopProps {
  itemType: string;
  isZip: boolean;
  isFolderItem: boolean;
  isFlow: boolean;
  isLoadingExtractionCompression: boolean;
  itemId: string;
  fileExtension: string | null;
  handleDeleteItem: () => void;
  handleDownloadFile: () => void;
  handleOpenItem: () => void;
  handleCopyItem: () => void;
  handleExtract: () => void;
  handleZipFile: () => void;
  runFlow: () => void;
  createFlow: () => void;
}

function getShowOpenIcon(
  itemType: string,
  isFolderItem: boolean,
  fileExtension: string | null,
) {
  if (itemType === "report") return true;
  if (itemType !== "file") return false;
  if (isFolderItem) return true;
  if (!fileExtension) return false;
  const extensionsWithViewers = ["wcax", "cft", "jpeg", "jpg", "png", "mp4"];
  const hasViewer = extensionsWithViewers.includes(fileExtension);
  return hasViewer;
}

export const ItemButtonsTop = ({
  itemType,
  isZip,
  isFolderItem,
  isFlow,
  isLoadingExtractionCompression,
  itemId,
  fileExtension,
  handleDeleteItem,
  handleDownloadFile,
  handleOpenItem,
  handleExtract,
  handleZipFile,
  runFlow,
  createFlow,
}: // handleCopyItem, don't remove
ItemButtonsTopProps) => {
  const isDownloadingItem = useStore((state) => state.isDownloadingItem);
  const isDeletingItem = useStore((state) => state.isDeletingItem);
  const isOpeningItem = useStore((state) => state.isOpeningItem);
  const downloadingItem = isDownloadingItem === itemId;
  const deletingItem = isDeletingItem === itemId;
  const openingItem = isOpeningItem === itemId;

  const showOpenIcon = getShowOpenIcon(itemType, isZip, fileExtension);

  return (
    <Flex direction="row" justify="flex-end" align="center" gap="1px">
      {(itemType === "file" ||
        itemType === "project" ||
        itemType === "report" ||
        itemType === "workspace" ||
        itemType === "workflow" ||
        itemType === "job") && (
        <IconRenderer
          icon={VCTrashIcon}
          tooltipLabel="Delete"
          isLoading={deletingItem}
          isdisabled={deletingItem}
          onClick={handleDeleteItem}
        />
      )}
      {itemType === "file" && !isFolderItem && (
        <IconRenderer
          icon={VCDownloadIcon}
          tooltipLabel="Download"
          isLoading={downloadingItem}
          isdisabled={downloadingItem}
          onClick={handleDownloadFile}
        />
      )}
      {/* {(itemType === "file" ||
        itemType === "model" ||
        itemType === "report") && (
        <IconRenderer
          onClick={handleCopyItem}
          icon={IconCopy}
          iconType="itemAction"
          tooltipText="Make a Copy"
        />
      )} */}
      {showOpenIcon && (
        <IconRenderer
          icon={VCOpenIcon}
          tooltipLabel="Open"
          isLoading={openingItem}
          isdisabled={openingItem}
          onClick={handleOpenItem}
        />
      )}
      {/* {(itemType === "file" || itemType === "report") && !isZip && (
        <IconRenderer
          icon={VCOpenIcon}
          tooltipLabel="Open"
          isLoading={openingItem}
          isdisabled={openingItem}
          onClick={handleOpenItem}
        />
      )} */}
      {isZip && (
        <IconRenderer
          icon={IconFolderOpen}
          tooltipLabel="Convert to folder"
          onClick={handleExtract}
          isdisabled={isLoadingExtractionCompression}
        />
      )}
      {isFlow && (
        <IconRenderer
          icon={VCWorkflowIcon}
          tooltipLabel="Create Workflow"
          onClick={createFlow}
          isdisabled={isLoadingExtractionCompression}
        />
      )}
      {isFolderItem && (
        <IconRenderer
          icon={VCFileZipIcon}
          tooltipLabel="Convert to zip"
          onClick={handleZipFile}
          isdisabled={isLoadingExtractionCompression}
        />
      )}
      {/* {isFlow && (
        <IconRenderer
          icon={VCJobsIcon}
          tooltipLabel="Run Job"
          onClick={runFlow}
          // isdisabled={isLoadingExtractionCompression}
        />
      )} */}
      {itemType === "workflow" && (
        <IconRenderer
          icon={VCJobsIcon}
          tooltipLabel="Create Job"
          onClick={runFlow}
          // isdisabled={isLoadingExtractionCompression}
        />
      )}
    </Flex>
  );
};
