import { useState } from "react";
import { Stack } from "@mantine/core";
import { useStore } from "../../store";
import { fileApi } from "../../apiActions/fileApi";
import { FileUpload } from "./FileUpload";
import { SubmitButton } from "../common/SubmitButton/SubmitButton";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { useMultipartUpload } from "../../customHooks/useMultipartUpload";
import { NewItemBase } from "../NewItemBase/NewItemBase";
import { AlertMsgType } from "../../store/actionSlice";
import { FileUploadStatusEnum } from "../../store/fileSlice";

const NewFile = () => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  // const addReloadComponent = useStore((state) => state.addReloadComponent);
  const addUpdateFileUpload = useStore((state) => state.addUpdateFileUpload);
  const setNewItemMetadata = useStore((state) => state.setNewItemMetadata);
  const setNewFileItem = useStore((state) => state.setNewFileItem);
  const [loadingAddItem, setLoadingAddItem] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState<string>("");
  const [inputFileUrl, setInputFileUrl] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [removeFile, setRemoveFile] = useState<boolean>(false);
  const multipartUpload = useMultipartUpload();

  const submitNormalFile = async (fileExtension: string) => {
    try {
      const { error: fileErr, data: fileData } = await fileApi.insertFile(
        fileTitle,
        itemDescription,
        "",
        categories,
        fileExtension,
      );

      if (fileErr) {
        return setDialogBoxMsg(fileErr, AlertMsgType.ERROR);
      }

      const { id, url } = fileData.file;

      multipartUpload(file as File, id, url);
      const newFileUpload = {
        itemId: id,
        title: fileTitle,
        status: FileUploadStatusEnum.PROGRESS,
        isCalculatingEstimatedTime: true,
        totalParts: 0,
        uploadedParts: 0,
        estimatedTime: 0,
      };
      addUpdateFileUpload(id, newFileUpload);

      resetData();
      setDialogBoxMsg("File added successfully", AlertMsgType.SUCCESS);
      // addReloadComponent("file");
      setNewItemMetadata(fileData.item);
      setNewFileItem(fileData.file);
    } catch (error) {
      console.error(error);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setLoadingAddItem(false);
    }
  };

  const getFileExtension = (file: File) => {
    const fileName = file?.name;
    const indexOfFileExtension = fileName?.indexOf(".");
    const fileExtension = fileName?.slice(indexOfFileExtension + 1);
    return fileExtension;
  };

  const handleAddItem = async () => {
    if (!fileTitle) {
      return setDialogBoxMsg("Enter file title", AlertMsgType.ERROR);
    }

    if (!file && !inputFileUrl) {
      return setDialogBoxMsg(
        "Enter file url or upload a file.",
        AlertMsgType.ERROR,
      );
    }

    setLoadingAddItem(true);
    const fileExtension = getFileExtension(file as File);
    submitNormalFile(fileExtension);
  };

  const resetData = () => {
    setFileTitle("New File");
    setInputFileUrl("");
    setItemDescription("");
    setCategories([]);
    setFile(null);
    setRemoveFile(true);
  };

  const onDrop = (file: File) => {
    setFile(file);
    setFileTitle(file?.name);
  };

  const onRemoveFile = () => {
    setFile(null);
    setFileTitle("");
    setRemoveFile(false);
  };

  return (
    <MaxWidthContainer>
      <Stack p="xs" gap="xs">
        <FileUpload
          disabled={loadingAddItem}
          removeFile={removeFile}
          onDrop={onDrop}
          onRemoveFile={onRemoveFile}
        />
        {/* don't remove */}
        {/* <Text ta="center" p="xs" size="xs">
        OR
      </Text>
      <TextBox
        pt="0px"
        title="File URL"
        placeholder="Not supported yet. Please upload a file."
        value={inputFileUrl}
        onChange={setInputFileUrl}
        disabled
      /> */}
        {/* don't remove */}
        <NewItemBase
          itemTitle={fileTitle}
          itemDescription={itemDescription}
          categories={categories}
          setItemTitle={setFileTitle}
          setItemDescription={setItemDescription}
          setCategories={async (tags) => setCategories(tags)}
        />
        <SubmitButton
          label="Add & Upload"
          onSubmit={handleAddItem}
          isLoading={loadingAddItem}
        />
      </Stack>
    </MaxWidthContainer>
  );
};

export default NewFile;
