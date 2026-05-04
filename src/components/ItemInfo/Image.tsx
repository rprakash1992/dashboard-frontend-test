import { useEffect, useState } from "react";
import { Box, Grid } from "@mantine/core";

import { ImageItem } from "../ImageItem";
import FileDropzone from "../common/FileDropzone/FileDropzone";
import { useStore } from "../../store";
import { getRandomImageName } from "../../utils/getRandomImageName";
import { storageApi } from "../../apiActions/storageApi";
// import { baseItemImageUrl } from "../../utils/misc";
import { itemApi } from "../../apiActions/itemApi";
import { AlertMsgType } from "../../store/actionSlice";

interface ImagesType {
  itemId: string;
  itemType: string;
  itemImage: string;
}

export const Image = ({ itemId, itemType, itemImage }: ImagesType) => {
  const [image, setImage] = useState<string>(itemImage);
  const [loading, setLoading] = useState<boolean>(false);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const addReloadComponent = useStore((state) => state.addReloadComponent);
  const setUpdatedItemMetadata = useStore(
    (state) => state.setUpdatedItemMetadata,
  );

  useEffect(() => {
    (async () => {
      const { data: downloadUrl } =
        await storageApi.getImageDownloadUrl(itemImage);

      if (downloadUrl) {
        setImage(downloadUrl);
      }
    })();
  }, []);

  const onDrop = async (files: File[]) => {
    if (!files || files.length <= 0) {
      return setDialogBoxMsg("Select an image.", AlertMsgType.ERROR);
    }
    try {
      setLoading(true);
      const file = files[0];
      const fileName = file?.name;
      const fileKey = getRandomImageName(fileName);
      // const folderName = "item-images";

      const contentType = file.type || "application/octet-stream";

      const { data: signed_url, error } = await storageApi.getImageUploadUrl(
        // folderName,
        fileKey,
        contentType,
      );

      if (error) {
        // setLoading(false);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (!signed_url) {
        return setDialogBoxMsg("No upload url found.", AlertMsgType.ERROR);
      }

      const newFile = new File([file], fileKey, { type: file.type });

      await fetch(`${signed_url}`, {
        method: "PUT",
        body: newFile,
        headers: { "Content-Type": contentType },
      });

      // const fileUrl = `${baseItemImageUrl}/${fileKey}`;

      const { data, error: itemerr } = await itemApi?.updateItemMetadata(
        itemId,
        itemType,
        "image",
        fileKey,
        // fileUrl,
      );

      if (itemerr) {
        return setDialogBoxMsg(itemerr, AlertMsgType.ERROR);
      }

      const { data: downloadUrl, error: downloadUrlErr } =
        await storageApi.getImageDownloadUrl(fileKey);

      if (downloadUrlErr) {
        return setDialogBoxMsg(downloadUrlErr, AlertMsgType.ERROR);
      }

      // setImage(fileUrl);
      setImage(downloadUrl);
      setDialogBoxMsg("Image updated successfully", AlertMsgType.SUCCESS);
      setUpdatedItemMetadata({
        ...data,
        image: downloadUrl,
      });
      // addReloadComponent(itemType);
    } catch (error) {
      setDialogBoxMsg(
        "An error occurred while uploading the image",
        AlertMsgType.ERROR,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        border: "0.0625rem dashed #373A40",
        borderRadius: "0.25rem",
        padding: "1rem",
        minHeight: "143px",
      }}
    >
      <Grid justify="space-around" align="center">
        <Grid.Col span={6}>
          <ImageItem imageFile={image ?? ""} />
        </Grid.Col>
        <Grid.Col span={6}>
          <FileDropzone onDrop={onDrop} loading={loading} />
        </Grid.Col>
      </Grid>
    </Box>
  );
};
