import { useEffect, useState } from "react";
import { Stack } from "@mantine/core";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { SubmitButton } from "../common/SubmitButton/SubmitButton";
import { useStore } from "../../store";
import { jobApi } from "../../apiActions/jobApi";
import { AlertMsgType } from "../../store/actionSlice";
import { NewItemBase } from "../NewItemBase/NewItemBase";
import { JobVariables } from "./JobVariables";
import { workflowApi } from "../../apiActions/workflowApi";
import type { WorkflowVariableType } from "../CreateFlow/CreateFlow";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";

const CreateJob = ({ itemId }: { itemId: string }) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [variables, setVariables] = useState<WorkflowVariableType[]>([]);
  const [variableValues, setVariableValues] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);

  useEffect(() => {
    if (itemId) {
      fetchJobDetails(itemId);
    }
  }, [itemId]);

  const fetchJobDetails = async (itemId: string) => {
    try {
      const { error, data } = await workflowApi.fetchWorkflowsByIds([itemId]);

      if (error) {
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      const jobDetails = data[0];
      const parameterSchema = jobDetails?.parameter_schema;

      const variables: WorkflowVariableType[] = [];

      Object.entries(parameterSchema).forEach(
        ([parameterName, parameterType]) => {
          variables.push({
            id: String(Math.floor(Math.random() * 100000)),
            variableName: parameterName,
            variableType: parameterType as string,
          });
        },
      );
      setVariables(variables);
    } catch (error) {
      console.error(error);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setIsFetchingData(false);
    }
  };

  const onSubmit = async () => {
    if (!itemId) {
      return setDialogBoxMsg("No item id provided.", AlertMsgType.ERROR);
    }
    if (!jobTitle) {
      return setDialogBoxMsg("Job Title is required.", AlertMsgType.ERROR);
    }

    try {
      setIsLoading(true);
      const { error } = await jobApi.runWorkflow(
        jobTitle,
        jobDescription,
        "",
        [],
        itemId,
        variableValues,
      );

      if (error) {
        console.error(error);
        return setDialogBoxMsg(String(error), AlertMsgType.ERROR);
      }

      setDialogBoxMsg("Job started successfully!", AlertMsgType.SUCCESS);
    } catch (error) {
      console.error(error);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVariableValues = (variableName: string, variableValue: any) => {
    setVariableValues((variableVals) => ({
      ...variableVals,
      [variableName]: variableValue,
    }));
  };

  if (isFetchingData) {
    return <LoadingComponent />;
  }

  return (
    <MaxWidthContainer>
      <Stack pb="xs" gap="xs">
        {variables.length > 0 && (
          <JobVariables
            variables={variables}
            variableValues={variableValues}
            updateVariableValues={updateVariableValues}
          />
        )}
        <NewItemBase
          itemTitle={jobTitle}
          itemDescription={jobDescription}
          categories={categories}
          setItemTitle={setJobTitle}
          setItemDescription={setJobDescription}
          setCategories={async (tags) => setCategories(tags)}
        />
        {/* <TextBox
          pt="0"
          title="Job Title"
          placeholder="Enter Job Title.."
          value={jobTitle}
          onChange={(val) => setJobTitle(val)}
        />
        <TextAreaBox
          rows={5}
          title="Job Description"
          placeholder="Enter Job Description.."
          value={jobDescription}
          onChange={(val) => setJobDescription(val)}
        /> */}
        <SubmitButton
          label="Start Job"
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </Stack>
    </MaxWidthContainer>
  );
};

export default CreateJob;
