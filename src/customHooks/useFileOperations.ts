// hooks/useFileOperations.ts
import { useState } from "react";
import { useNavigate } from "react-router";
import { useStore } from "../store";
import { fileApi } from "../apiActions/fileApi";
import { AlertMsgType } from "../store/actionSlice";
import {
  JobTypeEnum,
  RunDetailsPhaseEnum,
  type ItemMetadataType,
  type Job,
  type JobType,
  type RunDetailsPhaseType,
} from "../types";

export const useFileOperations = (
  setItemMetadata: React.Dispatch<React.SetStateAction<ItemMetadataType[]>>,
  setFileItems: React.Dispatch<React.SetStateAction<any[]>>,
  setRunItems: React.Dispatch<React.SetStateAction<Job[]>>,
) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const navigate = useNavigate();

  const [loadingExtractionsCompressions, setLoadingExtractionsCompressions] =
    useState<string[]>([]);

  const handleExtract = async (itemId: string) => {
    try {
      setLoadingExtractionsCompressions((items) =>
        Array.from(new Set([...items, itemId])),
      );

      const { error, data } = await fileApi.extractFile(itemId);

      if (error) {
        console.error(error);
        return setDialogBoxMsg(String(error), AlertMsgType.ERROR);
      }

      const { item, file } = data;
      setItemMetadata((prev) => [...prev, item]);
      setFileItems((prev) => [...prev, file]);
      setRunItems((prev) => [
        ...prev,
        {
          id: "",
          job_type: JobTypeEnum.ZIP_TO_FOLDER as JobType,
          total_steps: null,
          completed_steps: null,
          run_id: null,
          run_details: {
            id: "",
            name: "",
            created_at: "",
            start_time: "",
            endTime: null,
            phase: RunDetailsPhaseEnum.RUNNING as RunDetailsPhaseType,
          },
          output_item_id: item.id,
        },
      ]);
    } catch (error) {
      console.error(error);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setLoadingExtractionsCompressions((items) =>
        items.filter((i) => i !== itemId),
      );
    }
  };

  const handleZipFile = async (itemId: string) => {
    try {
      setLoadingExtractionsCompressions((items) =>
        Array.from(new Set([...items, itemId])),
      );

      const { error, data } = await fileApi.compressFile(itemId);

      if (error) {
        console.error(error);
        return setDialogBoxMsg(String(error), AlertMsgType.ERROR);
      }

      const { item, file } = data;
      setItemMetadata((prev) => [...prev, item]);
      setFileItems((prev) => [...prev, file]);
      setRunItems((prev) => [
        ...prev,
        {
          id: "",
          job_type: JobTypeEnum.FOLDER_TO_ZIP as JobType,
          total_steps: null,
          completed_steps: null,
          run_id: null,
          run_details: {
            id: "",
            name: "",
            created_at: "",
            start_time: "",
            endTime: null,
            phase: RunDetailsPhaseEnum.RUNNING as RunDetailsPhaseType,
          },
          output_item_id: item.id,
        },
      ]);
    } catch (error) {
      console.error(error);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setLoadingExtractionsCompressions((items) =>
        items.filter((i) => i !== itemId),
      );
    }
  };

  const runFlow = (itemId: string) => {
    navigate(
      `/create-job?tabId=create_job&tabTitle=Create Job&itemId=${itemId}`,
    );
  };

  const createFlow = (itemId: string) => {
    navigate(
      `/create-workflow?tabId=create_workflow&tabTitle=Create Workflow&itemId=${itemId}`,
    );
  };

  return {
    loadingExtractionsCompressions,
    handleExtract,
    handleZipFile,
    runFlow,
    createFlow,
  };
};
