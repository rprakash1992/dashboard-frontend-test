import { ExtractionProgress } from "./ExtractionProgress";
import { CompressionProgress } from "./CompressionProgress";
import { JobProgress } from "./JobProgress";
import ItemUploadInProgress from "./ItemUploadInProgress";

export const ItemProgress = ({
  itemId,
  cardType,
  onComplete,
}: {
  itemId: string;
  cardType: string;
  onComplete: (itemId: string) => void;
}) => {
  const getComponent: Record<string, any> = {
    fileExtraction: ExtractionProgress,
    fileCompression: CompressionProgress,
    jobProgress: JobProgress,
    fileUploadProgress: ItemUploadInProgress
  };

  const Component = getComponent[cardType];

  return <Component itemId={itemId} onComplete={onComplete} />;
};
