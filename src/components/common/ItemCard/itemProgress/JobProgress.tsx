import { useEffect, useRef } from "react";
import { useStore } from "../../../../store";
import { jobApi } from "../../../../apiActions/jobApi";
import { ItemProgress } from "./ItemProgress";
import { RunDetailsPhaseEnum } from "../../../../types";

export const JobProgress = ({ itemId }: { itemId: string }) => {
  const addReloadComponent = useStore((state) => state.addReloadComponent);
  const timer = useRef<any>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;

    async function poll() {
      if (cancelled.current) return;

      try {
        const { data, error } = await jobApi.fetchJobsByIds([itemId]);

        if (cancelled.current) return;

        if (error) {
          clearTimeout(timer.current);
          return;
        }

        if (data && data.length > 0) {
          const job = data[0];
          const run_details = job?.run_details;

          // if (run_details?.phase === "Succeeded") {
          if (run_details?.phase === RunDetailsPhaseEnum.SUCCEEDED) {
            clearTimeout(timer.current);
            addReloadComponent("job");
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

      timer.current = setTimeout(poll, 5000);
    }

    poll();

    return () => {
      cancelled.current = true;
      clearTimeout(timer.current);
    };
  }, [itemId, addReloadComponent]);

  return <ItemProgress label="Job in Progress" />;
};
