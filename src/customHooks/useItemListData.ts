// hooks/useItemListData.ts
import { useEffect, useState } from "react";
import { useStore } from "../store";
import type { ViewItemPropertyType } from "../store/viewSlice";
import { getItemsToDisplay } from "../utils/getItemsToDisplay";
import { fileApi } from "../apiActions/fileApi";
import { itemApi } from "../apiActions/itemApi";
import { jobApi } from "../apiActions/jobApi";
import {
  type FileUploadDetails,
  FileUploadStatusEnum,
} from "../store/fileSlice";
import { AlertMsgType } from "../store/actionSlice";
import {
  type ItemMetadataType,
  type Job,
  type ItemsToDisplayType,
  RunDetailsPhaseEnum,
} from "../types";
import { storageApi } from "../apiActions/storageApi";

export const useItemListData = (viewId: string) => {
  const tags = useStore((state) => state.tags);
  const viewProperties = useStore((state) => state.viewProperties);
  const reloadComponents = useStore((state) => state.reloadComponents);
  const fileUploads = useStore((state) => state.fileUploads);
  const updatedItemMetadata = useStore((state) => state.updatedItemMetadata);
  const newItemMetadata = useStore((state) => state.newItemMetadata);
  const newFileItem = useStore((state) => state.newFileItem);
  const removeItemMetadata = useStore((state) => state.removeItemMetadata);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const setFileUploads = useStore((state) => state.setFileUploads);
  const removeReloadComponent = useStore(
    (state) => state.removeReloadComponent,
  );
  const setUpdatedItemMetadata = useStore(
    (state) => state.setUpdatedItemMetadata,
  );
  const setNewItemMetadata = useStore((state) => state.setNewItemMetadata);
  const setNewFileItem = useStore((state) => state.setNewFileItem);
  const setRemoveItemMetadata = useStore(
    (state) => state.setRemoveItemMetadata,
  );
  const [loadingDashboardItems, setLoadingDashboardItems] =
    useState<boolean>(true);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ViewItemPropertyType>();
  const [activeViewAs, setActiveViewAs] = useState<string>("grid");
  const [itemsToDisplay, setItemsToDisplay] = useState<ItemsToDisplayType[]>(
    [],
  );
  const [itemsMetadata, setItemMetadata] = useState<ItemMetadataType[]>([]);
  const [fileItems, setFileItems] = useState<any[]>([]);
  const [jobItems, setJobItems] = useState<any[]>([]);
  const [runItems, setRunItems] = useState<Job[]>([]);
  const [viewsBreadcrum, setViewsBreadcrum] = useState<ViewItemPropertyType[]>(
    [],
  );

  useEffect(() => {
    if (
      newItemMetadata &&
      activeView?.item_type === newItemMetadata.item_type
    ) {
      setItemMetadata((prevMetadata) => [newItemMetadata, ...prevMetadata]);
      setNewItemMetadata(null);
      if (newFileItem) {
        setFileItems((prevFiles) => [newFileItem, ...prevFiles]);
        setNewFileItem(null);
      }
    }
  }, [newItemMetadata, newFileItem]);

  useEffect(() => {
    if (
      removeItemMetadata &&
      activeView?.item_type === removeItemMetadata.item_type
    ) {
      setItemMetadata(
        itemsMetadata.filter((item) => item.id !== removeItemMetadata.id),
      );
      setRemoveItemMetadata(null);
    }
  }, [removeItemMetadata]);

  useEffect(() => {
    if (updatedItemMetadata) {
      setItemMetadata(
        itemsMetadata.map((item) =>
          item.id === updatedItemMetadata.id ? updatedItemMetadata : item,
        ),
      );
      setUpdatedItemMetadata(null);
    }
  }, [updatedItemMetadata]);

  useEffect(() => {
    if (
      activeView?.item_type &&
      reloadComponents.includes(activeView?.item_type)
    ) {
      fetchItems(activeView?.item_type);
    }
  }, [reloadComponents]);

  useEffect(() => {
    const view = viewProperties.find(
      (view) => String(view.id) === String(viewId),
    ) as ViewItemPropertyType;

    setActiveView(view);
    setViewsBreadcrum([view]);
    setActiveViewAs(view?.view_as ?? "grid");
    // fetchItems(view?.item_type);
  }, [viewProperties, viewId]);

  useEffect(() => {
    if (activeView) {
      fetchItems(activeView?.item_type);
    }
  }, [activeView?.id]);

  useEffect(() => {
    const items = getItemsToDisplay(
      itemsMetadata,
      activeView as ViewItemPropertyType,
      tags,
      fileItems,
    );
    setItemsToDisplay(items);
  }, [activeView, itemsMetadata, fileItems, viewProperties]);

  const fetchItemDetails = async (
    itemType: string,
    data: ItemMetadataType[],
  ) => {
    const detailFetchers: Record<
      string,
      (items: ItemMetadataType[]) => Promise<void>
    > = {
      file: async (items) => {
        await Promise.allSettled([
          fetchFileDetails(items),
          fetchRunDetails(items),
        ]);
      },
      job: fetchJobDetails,
    };

    await detailFetchers[itemType]?.(data);
  };

  const fetchItems = async (itemType: string) => {
    try {
      setLoadingDashboardItems(true);
      const { data, error } = await itemApi.fetchDashboardItems(itemType);

      if (error) {
        setErrorState(true);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (data?.length > 0) {
        await fetchItemDetails(itemType, data);
        setItemMetadata(data);
        setLoadingDashboardItems(false);

        const itemImagesKeys: string[] = data.map(
          (item: ItemMetadataType) => item.image,
        );

        const { data: itemImagesUrls } =
          await storageApi.getImageDownloadUrls(itemImagesKeys);

        setItemMetadata(
          data.map((i: ItemMetadataType, j: number) => ({
            ...i,
            image: itemImagesUrls[j],
          })),
        );
      }
    } catch (error) {
      setErrorState(true);
      return setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setLoadingDashboardItems(false);
      removeReloadComponent("file");
    }
  };

  const fetchFileDetails = async (items: ItemMetadataType[]) => {
    const itemIds = items.map((item) => item.id);
    const { data: filesData, error: filesErr } =
      await fileApi.fetchFilesByIds(itemIds);

    if (filesErr) {
      setErrorState(true);
      return setDialogBoxMsg(filesErr, AlertMsgType.ERROR);
    }

    if (!filesData?.length) return;

    setFileItems(filesData);

    // const fileUploadsDetails: Record<string, any> = {};
    const fileUploadsDetails: FileUploadDetails = {};

    filesData.forEach((file: any) => {
      const item = items.find((d) => d?.id === file?.id)!;
      const existing = fileUploads[file?.id];

      fileUploadsDetails[file.id] = {
        itemId: file.id,
        title: item?.title,
        status: file.is_uploaded
          ? FileUploadStatusEnum.COMPLETED
          : existing
            ? existing.status
            : FileUploadStatusEnum.FAILED,
        isCalculatingEstimatedTime:
          existing?.isCalculatingEstimatedTime ?? false,
        totalParts: existing?.totalParts ?? 0,
        uploadedParts: existing?.uploadedParts ?? 0,
        estimatedTime: existing?.estimatedTime ?? 0,
      };
    });

    setFileUploads(fileUploadsDetails);
  };

  const fetchRunDetails = async (items: ItemMetadataType[]) => {
    const itemIds = items.map((item) => item.id);
    if (itemIds.length <= 0) return;

    const { data, error } = await jobApi?.fetchJobsByOutputItemsIds(itemIds);

    if (error) {
      setErrorState(true);
      return setDialogBoxMsg(error, AlertMsgType.ERROR);
    }

    if (data && data.length > 0) {
      const inProgressJobs = data.filter(
        (job: Job) => job.run_details?.phase !== RunDetailsPhaseEnum.SUCCEEDED,
      );
      setRunItems(inProgressJobs);
    }
  };

  const removeRunItem = (itemId: string) => {
    setRunItems((prev) => prev.filter((job) => job.output_item_id !== itemId));
  };

  const fetchJobDetails = async (items: ItemMetadataType[]) => {
    const jobIds = items.map((item) => item.id);

    const { data, error } = await jobApi.fetchJobsByIds(jobIds);

    if (error) {
      setErrorState(true);
      return setDialogBoxMsg(error, AlertMsgType.ERROR);
    }

    setJobItems(data);
  };

  return {
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
  };
};
