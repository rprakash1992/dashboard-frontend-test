import { Box, Image } from "@mantine/core";
import DefaultItemImage from "../../../assets/images/no-image.png";
import {
  VCFileZipIcon,
  VCFolderIcon,
  VCWorkspaceIcon,
} from "../../../assets/icons";

const ZipImage = () => (
  <Box
    style={{
      overflow: "hidden",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <VCFileZipIcon size={53} />
  </Box>
);

const FolderImage = () => (
  <Box
    style={{
      overflow: "hidden",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <VCFolderIcon size={53} />
  </Box>
);

const WorkspaceImage = () => (
  <Box
    style={{
      overflow: "hidden",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <VCWorkspaceIcon size={53} />
  </Box>
);

const RegularImage = ({
  itemImage,
  itemTitle,
}: {
  itemImage: string;
  itemTitle: string;
}) => (
  <Image
    height="116px"
    src={itemImage}
    alt={`${itemTitle}_image`}
    onError={(e) => {
      (e.currentTarget as HTMLImageElement).src = DefaultItemImage;
    }}
  />
);

export const ItemImage = ({
  isFolderItem,
  isZip,
  itemType,
  itemTitle,
  itemImage,
}: {
  isFolderItem: boolean;
  isZip: boolean;
  itemType: string;
  itemTitle: string;
  itemImage: string;
}) => {
  return isFolderItem ? (
    <FolderImage />
  ) : isZip ? (
    <ZipImage />
  ) : itemType === "workspace" ? (
    <WorkspaceImage />
  ) : (
    <RegularImage
      itemImage={itemImage || DefaultItemImage}
      itemTitle={itemTitle}
    />
  );
};
