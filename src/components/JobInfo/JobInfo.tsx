import { useEffect, useState } from "react";
import { Box, Stack } from "@mantine/core";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { useStore } from "../../store";
import { jobApi } from "../../apiActions/jobApi";
import { Label } from "../common/Label/Label";
import { LabelValue } from "../common/LabelValue/LabelValue";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";
import { getTimeLapsed } from "../../utils/misc";
import { AlertMsgType } from "../../store/actionSlice";

const JobInfo = ({ itemId }: { itemId: string }) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [jobDetails, setJobDetails] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (itemId) {
      fetchJobInfo(itemId);
    }
  }, [itemId]);

  const fetchJobInfo = async (itemId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await jobApi.fetchJobsByIds([itemId]);

      if (error) {
        console.error(error);
        setDialogBoxMsg(String(error), AlertMsgType.ERROR);
      }

      if (data && data.length > 0) {
        setJobDetails(data[0]);
      }
    } catch (error) {
      console.error(error);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || Object.keys(jobDetails).length <= 0) {
    return <LoadingComponent />;
  }

  return (
    <MaxWidthContainer>
      <Stack p="10px" gap="xs">
        <Box>
          <Label label="Name" />
          <LabelValue labelValue={jobDetails?.run_details?.name ?? ""} />
        </Box>
        <Box>
          <Label label="Status" />
          <LabelValue labelValue={jobDetails?.run_details?.phase ?? ""} />
        </Box>
        <Box>
          <Label label="Job Type" />
          <LabelValue labelValue={jobDetails?.job_type ?? ""} />
        </Box>
        <Box>
          <Label label="Total Steps" />
          <LabelValue labelValue={jobDetails?.total_steps ?? "Not Defined"} />
        </Box>
        <Box>
          <Label label="Completed Steps" />
          <LabelValue
            labelValue={jobDetails?.completed_steps ?? "Not Defined"}
          />
        </Box>
        <Box>
          <Label label="Total Run Time" />
          <LabelValue
            labelValue={`${Number(getTimeLapsed(jobDetails?.run_details?.start_time ?? "")) - Number(getTimeLapsed(jobDetails?.run_details?.end_time ?? ""))} sec`}
          />
        </Box>
        <Box>
          <Label label="Created" />
          <LabelValue
            labelValue={getTimeLapsed(
              jobDetails?.run_details?.created_at ?? "",
            )}
          />
        </Box>
        <Box>
          <Label label="Started" />
          <LabelValue
            labelValue={getTimeLapsed(
              jobDetails?.run_details?.start_time ?? "",
            )}
          />
        </Box>
        <Box>
          <Label label="Ended" />
          <LabelValue
            labelValue={getTimeLapsed(jobDetails?.run_details?.end_time ?? "")}
          />
        </Box>
      </Stack>
    </MaxWidthContainer>
  );
};

export default JobInfo;
