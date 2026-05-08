// hooks/useItemActions.ts
import { useNavigate } from "react-router";
import { useStore } from "../store";
import { reportApi } from "../apiActions/reportApi";
import { fileApi } from "../apiActions/fileApi";
import { itemApi } from "../apiActions/itemApi";
import { AlertMsgType } from "../store/actionSlice";
import type { File, ItemMetadataType } from "../types";

export const useItemActions = (fileItems: File[]) => {
  const navigate = useNavigate();
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const setShowCommentBox = useStore((state) => state.setShowCommentBox);
  // const addReloadComponent = useStore((state) => state.addReloadComponent);
  const setRemoveItemMetadata = useStore(
    (state) => state.setRemoveItemMetadata,
  );
  const setIsDeletingItem = useStore((state) => state.setIsDeletingItem);
  const setIsDownloadingItem = useStore((state) => state.setIsDownloadingItem);
  const setIsOpeningItem = useStore((state) => state.setIsOpeningItem);

  const handleCopyItem = (_item: ItemMetadataType) => {
    // not yet implemented
  };

  const handleDeleteItem = async (item: ItemMetadataType) => {
    try {
      if (item.item_type === "file") {
        const isFolderItem = !!fileItems.find(
          (file) => file.parent === item.id,
        );
        if (isFolderItem) {
          // folder delete not yet implemented
          return;
        }
      }
      setIsDeletingItem(item.id);
      const { error } = await itemApi.deleteItemById(item.id, item.item_type);
      if (error) return setDialogBoxMsg(error, AlertMsgType.ERROR);
      setDialogBoxMsg("Item deleted successfully.", AlertMsgType.SUCCESS);
      setRemoveItemMetadata(item);
      // addReloadComponent(item.item_type);
    } catch (error) {
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setIsDeletingItem(null);
    }
  };

  const downloadWrapper = async (item: ItemMetadataType) => {
    const { data: downloadUrl, error } = await fileApi.downloadFile(item.id);
    if (error) return setDialogBoxMsg(error, AlertMsgType.ERROR);
    const anchor = document.createElement("a");
    anchor.setAttribute("href", downloadUrl);
    anchor.setAttribute("target", "_blank");
    anchor.click();
    anchor.remove();
    setDialogBoxMsg("Download Started.", AlertMsgType.SUCCESS);
  };

  const handleDownloadFile = async (item: ItemMetadataType) => {
    setIsDownloadingItem(item.id);
    await downloadWrapper(item);
    setIsDownloadingItem(null);
  };

  // unused openItem code which was used previously
  // const openItem = async (itemId: string) => {
  //   const { data: downloadUrl, error } = await fileApi.downloadFile(itemId);

  //   if (error) {
  //     return setDialogBoxMsg(error, AlertMsgType.ERROR);
  //   }

  //   // if (uploadUrl?.includes(".wcax")) {
  //   // const vcollabViewerLink =
  //   //   "https://apps.vcollab.com/vcollabweb/viewer.html?file=";

  //   const vcollabViewerLink = "/WCAXVIEWER.html?file=";

  //   window.open(vcollabViewerLink + encodeURIComponent(downloadUrl), "_blank");
  //   // }
  //   // else {
  //   //   const anchor = document.createElement("a");
  //   //   anchor.setAttribute("href", downloadUrl);
  //   //   anchor.setAttribute("id", "downloadFile");
  //   //   anchor.setAttribute("target", "_blank");
  //   //   anchor.click();
  //   //   anchor.remove();

  //   //   setDialogBoxMsg("Download started.", AlertMsgType.SUCCESS);
  //   // }
  // };

  const openReport = async (item: ItemMetadataType) => {
    setIsOpeningItem(item.id);
    let fileExtension = "";

    const { data, error } = await itemApi.getItemTraceability(item.id);

    if (error) {
      setIsOpeningItem(null);
      return setDialogBoxMsg(error, AlertMsgType.ERROR);
    }

    const report_traceability_data = data.traceability_data;
    const project = report_traceability_data.projects[0];
    const projectId = project.id;

    const { data: data1, error: error1 } =
      await itemApi.getItemTraceability(projectId);

    if (error1) {
      setIsOpeningItem(null);
      return setDialogBoxMsg(error, AlertMsgType.ERROR);
    }

    const project_traceability_data = data1.traceability_data;
    const file = project_traceability_data.files[0];
    const fileId = file.id;

    const { data: filesData, error: filesErr } = await fileApi.fetchFilesByIds([
      fileId,
    ]);
    if (filesErr) {
      setIsOpeningItem(null);
      return setDialogBoxMsg(filesErr, AlertMsgType.ERROR);
    }

    fileExtension = filesData[0].mime_type;

    const { data: reportsData, error: reportsErr } =
      await reportApi.fetchReportByIds([item.id]);

    if (reportsErr) {
      setIsOpeningItem(null);
      return setDialogBoxMsg(error, AlertMsgType.ERROR);
    }

    setIsOpeningItem(null);
    if (reportsData?.length > 0 && fileExtension === "cax") {
      navigate(
        `/epviewer?tabId=epViewer-${item.id}&tabTitle=Enterprise Viewer-${item.title}&itemId=${item.id}&fileId=${fileId}`,
      );
    } else {
      setDialogBoxMsg("No viewer found for this report.", AlertMsgType.ERROR);
    }
  };

  const handleOpenItem = async (item: ItemMetadataType) => {
    const itemType = item.item_type;

    if (itemType === "file") {
      openFileItem(item);
    }

    if (itemType === "report") {
      openReport(item);
    }
  };

  const openFileItem = async (item: ItemMetadataType) => {
    const fileItem = fileItems.find((file) => file.id === item.id);
    // const isFolderItem = fileItems.find((file) => file.parent === item.id);

    // if (isFolderItem) {
    //   return { action: "openFolder" as const, item };
    // }

    const fileExtension = fileItem?.mime_type;

    if (fileExtension === "wcax") {
      navigate(
        `/wcxviewer?tabId=wcaxviewer-${item.id}&tabTitle=WCAX Viewer-${item.title}&itemId=${item.id}`,
      );
    } else if (fileExtension === "cft") {
      navigate(
        `/cftviewer?tabId=craft_report_viewer-${item.id}&tabTitle=Report Viewer-${item.title}&itemId=${item.id}`,
      );
    } else if (
      ["jpeg", "jpg", "png", "mp4"].includes(fileExtension as string)
    ) {
      navigate(
        `/mediaviewer?tabId=mediaviewer-${item.id}&tabTitle=Media Viewer-${item.title}&itemId=${item.id}`,
      );
    } else {
      setIsOpeningItem(item.id);
      // handleDownloadFile(item);
      await downloadWrapper(item);
      setIsOpeningItem(null);
    }
  };

  const selectItemProperty = (
    item: ItemMetadataType,
    id: string,
    route: string,
    showCommentBox: boolean,
  ) => {
    navigate(
      `${route}?tabId=${id}-${item.id}&tabTitle=${item.title}&itemId=${item.id}`,
    );
    setShowCommentBox(showCommentBox);
  };

  const handleCommentClick = async () => {};

  return {
    handleCopyItem,
    handleDeleteItem,
    handleDownloadFile,
    handleOpenItem,
    selectItemProperty,
    handleCommentClick,
  };
};
