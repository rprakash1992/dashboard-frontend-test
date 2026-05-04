import type { ItemMetadataType, Job } from "../../types";
import { useGetCardType } from "../../customHooks/useGetCardType";
import { DefaultCard } from "./DefaultCard";
import { GridCardLayout } from "./GridItemCardLayout";
import { ItemImage } from "../common/ItemCard/ItemImage";
import ItemUploadFailed from "../common/ItemCard/ItemUploadFailed";
// import ItemUploadInProgress from "../common/ItemCard/ItemUploadInProgress";
import type { FileUploadDetail } from "../../store/fileSlice";
// import { ItemProgress } from "../common/ItemCard/itemProgress/index";
import { ItemProgress } from "../common/ItemCard/itemPercentageProgress/index";

interface GridItemCardProps {
  fileExtension: string | null;
  fileUploadDetails: FileUploadDetail;
  item: ItemMetadataType;
  isFolderItem: boolean;
  isZip: boolean;
  isFlow: boolean;
  runDetails: Job | undefined;
  isLoadingExtractionCompression: boolean;
  jobDetails: Job | null;
  onComplete: (itemId: string) => void;
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

export const GridItemCard = ({
  fileExtension,
  fileUploadDetails,
  item,
  isFolderItem,
  isZip,
  isFlow,
  runDetails,
  isLoadingExtractionCompression,
  jobDetails,
  onComplete,
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
}: GridItemCardProps) => {
  const itemType = item.item_type;

  const cardType = useGetCardType(
    itemType,
    fileUploadDetails,
    runDetails,
    jobDetails,
  );

  if (cardType === "fileUploadFailed") {
    return (
      <GridCardLayout
        item={item}
        imageSection={
          <ItemImage
            isFolderItem={isFolderItem}
            isZip={isZip}
            itemType={itemType}
            itemTitle={item.title}
            itemImage={item.image}
          />
        }
        topButtonsSection={null}
        dateSection={null}
        bottomButtonsSection={
          <ItemUploadFailed itemId={item.id} fileExtension={fileExtension} />
        }
      />
    );
  }

  if (cardType === "fileUploadProgress") {
    return (
      <GridCardLayout
        item={item}
        imageSection={
          <ItemImage
            isFolderItem={isFolderItem}
            isZip={isZip}
            itemType={itemType}
            itemTitle={item.title}
            itemImage={item.image}
          />
        }
        topButtonsSection={null}
        dateSection={null}
        bottomButtonsSection={
          <ItemProgress
            itemId={item.id}
            cardType="fileUploadProgress"
            onComplete={() => {}}
          />
        }
      />
    );
  }

  if (cardType === "fileExtraction") {
    return (
      <GridCardLayout
        item={item}
        imageSection={
          <ItemImage
            isFolderItem={isFolderItem}
            isZip={isZip}
            itemType={itemType}
            itemTitle={item.title}
            itemImage={item.image}
          />
        }
        topButtonsSection={null}
        dateSection={null}
        bottomButtonsSection={
          <ItemProgress
            itemId={item.id}
            cardType="fileExtraction"
            onComplete={onComplete}
          />
        }
      />
    );
  }

  if (cardType === "fileCompression") {
    return (
      <GridCardLayout
        item={item}
        imageSection={
          <ItemImage
            isFolderItem={isFolderItem}
            isZip={isZip}
            itemType={itemType}
            itemTitle={item.title}
            itemImage={item.image}
          />
        }
        topButtonsSection={null}
        dateSection={null}
        bottomButtonsSection={
          <ItemProgress
            itemId={item.id}
            cardType="fileCompression"
            onComplete={onComplete}
          />
        }
      />
    );
  }

  // if (cardType === "jobFailed") {
  //   return (
  //     <GridCardLayout
  //       item={item}
  //       imageSection={
  //         <ItemImage
  //           isFolderItem={isFolderItem}
  //           isZip={isZip}
  //           itemType={itemType}
  //           itemTitle={item.title}
  //           itemImage={item.image}
  //         />
  //       }
  //       topButtonsSection={null}
  //       dateSection={null}
  //       bottomButtonsSection={<ItemJobProgress itemId={item.id} />}
  //     />
  //   );
  // }

  if (cardType === "jobProgress") {
    return (
      <GridCardLayout
        item={item}
        imageSection={
          <ItemImage
            isFolderItem={isFolderItem}
            isZip={isZip}
            itemType={itemType}
            itemTitle={item.title}
            itemImage={item.image}
          />
        }
        topButtonsSection={null}
        dateSection={null}
        bottomButtonsSection={
          <ItemProgress
            itemId={item.id}
            cardType="jobProgress"
            onComplete={() => {}}
          />
        }
      />
    );
  }

  return (
    <DefaultCard
      item={item}
      isFolderItem={isFolderItem}
      isZip={isZip}
      isFlow={isFlow}
      isLoadingExtractionCompression={isLoadingExtractionCompression}
      fileExtension={fileExtension}
      handleDeleteItem={handleDeleteItem}
      handleOpenItem={handleOpenItem}
      handleDownloadFile={handleDownloadFile}
      handleCommentClick={handleCommentClick}
      handlePropertyBtnClick={handlePropertyBtnClick}
      handleCopyItem={handleCopyItem}
      handleExtract={handleExtract}
      handleZipFile={handleZipFile}
      runFlow={runFlow}
      createFlow={createFlow}
    />
  );
};
