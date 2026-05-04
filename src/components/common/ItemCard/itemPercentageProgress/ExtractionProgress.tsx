import { useEffect, useRef, useState } from "react";
import { useStore } from "../../../../store";
import { jobApi } from "../../../../apiActions/jobApi";
import { ItemPercentageProgress } from "./ItemPercentageProgress";
import { RunDetailsPhaseEnum } from "../../../../types";

export const ExtractionProgress = ({
  itemId,
  onComplete,
}: {
  itemId: string;
  onComplete: (itemId: string) => void;
}) => {
  const addReloadComponent = useStore((state) => state.addReloadComponent);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const timer = useRef<any>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    if (totalSteps === 0) {
      setProgress(0);
    } else {
      setProgress((completedSteps * 100) / totalSteps);
    }
  }, [totalSteps, completedSteps]);

  useEffect(() => {
    cancelled.current = false;

    async function poll() {
      if (cancelled.current) return;

      try {
        const { data, error } = await jobApi.fetchJobsByOutputItemsIds([
          itemId,
        ]);

        if (cancelled.current) return;

        if (error) {
          clearTimeout(timer.current);
          return;
        }

        if (data && data.length > 0) {
          const job = data[0];
          const run_details = job?.run_details;
          setTotalSteps(Number(job?.total_steps) ?? 0);
          setCompletedSteps(Number(job?.completed_steps) ?? 0);

          // if (run_details?.phase === "Succeeded") {
          if (run_details?.phase === RunDetailsPhaseEnum.SUCCEEDED) {
            onComplete(itemId);
            clearTimeout(timer.current);
            addReloadComponent("file");
            return;
          }
        }
      } catch (e) {
        if (!cancelled.current) {
          console.error(e);
        }
        clearTimeout(timer.current);
        return;
      }

      timer.current = setTimeout(poll, 2000);
    }

    poll();

    return () => {
      cancelled.current = true;
      clearTimeout(timer.current);
    };
  }, [itemId, addReloadComponent]);

  return (
    <ItemPercentageProgress progress={progress} label="Converting to Folder" />
  );
};
