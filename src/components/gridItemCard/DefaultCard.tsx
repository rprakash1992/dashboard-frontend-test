import DefaultItemImage from "../../assets/images/no-image.png";
import { ItemButtonsTop } from "../common/ItemCard/ItemButtonsTop";
import { ItemButtonsBottom } from "../common/ItemCard/ItemButtonsBottom";
import type { ItemMetadataType } from "../../types";
import { ItemTitle } from "../common/ItemCard/ItemTitle";
import { ItemDates } from "../common/ItemCard/ItemDates";
import { ItemImage } from "../common/ItemCard/ItemImage";
import { GridCardLayout } from "./GridItemCardLayout";

interface DefaultCardProps {
  item: ItemMetadataType;
  isFolderItem: boolean;
  isZip: boolean;
  isFlow: boolean;
  isLoadingExtractionCompression: boolean;
  fileExtension: string | null;
  handleDeleteItem: () => void;
  handleOpenItem: () => void;
  handleDownloadFile: () => void;
  handleCommentClick: () => void;
  handlePropertyBtnClick: (property: string, route: string) => void;
  handleCopyItem: () => void;
  handleExtract: () => void;
  handleZipFile: () => void;
  runFlow: () => void;
  createFlow: () => void;
}

export const DefaultCard = ({
  item,
  isFolderItem,
  isZip,
  isFlow,
  isLoadingExtractionCompression,
  fileExtension,
  handleDeleteItem,
  handleOpenItem,
  handleDownloadFile,
  handleCommentClick,
  handlePropertyBtnClick,
  handleCopyItem,
  handleExtract,
  handleZipFile,
  runFlow,
  createFlow,
}: DefaultCardProps) => {
  // const { borderColor } = useCustomColors();
  const itemType = item.item_type;
  const itemTitle = item.title;
  const itemImage = item.image ?? DefaultItemImage;
  const createdAt = item.created_at;
  const lastModifiedAt = item.last_modified_at;

  const titleSection = <ItemTitle title={itemTitle} showTooltip />;

  const imageSection = (
    <ItemImage
      isFolderItem={isFolderItem}
      isZip={isZip}
      itemType={itemType}
      itemTitle={itemTitle}
      itemImage={itemImage}
    />
  );

  const dateSection = (
    <ItemDates
      lastModifiedAt={lastModifiedAt ?? ""}
      createdAt={createdAt ?? ""}
    />
  );

  const topButtonsSection = (
    <ItemButtonsTop
      itemId={item.id}
      itemType={itemType}
      isZip={isZip}
      isFolderItem={isFolderItem}
      isFlow={isFlow}
      isLoadingExtractionCompression={isLoadingExtractionCompression}
      fileExtension={fileExtension}
      handleDeleteItem={handleDeleteItem}
      handleDownloadFile={handleDownloadFile}
      handleOpenItem={handleOpenItem}
      handleCopyItem={handleCopyItem}
      handleExtract={handleExtract}
      handleZipFile={handleZipFile}
      runFlow={runFlow}
      createFlow={createFlow}
    />
  );

  const bottomButtonsSection = (
    <ItemButtonsBottom
      itemId={item.id}
      itemType={itemType}
      handleCommentClick={handleCommentClick}
      handlePropertyBtnClick={handlePropertyBtnClick}
    />
  );

  return (
    <GridCardLayout
      item={item}
      titleSection={titleSection}
      imageSection={imageSection}
      dateSection={dateSection}
      topButtonsSection={topButtonsSection}
      bottomButtonsSection={bottomButtonsSection}
    />
  );
};
