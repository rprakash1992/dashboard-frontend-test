import { useState } from "react";
import { Stack } from "@mantine/core";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { SubmitButton } from "../common/SubmitButton/SubmitButton";
import { useStore } from "../../store";
import { workflowApi } from "../../apiActions/workflowApi";
import { AlertMsgType } from "../../store/actionSlice";
import { NewItemBase } from "../NewItemBase/NewItemBase";
import { WorkflowVariables } from "../WorkflowVariables/WorkflowVariables";

export interface WorkflowVariableType {
  id: string;
  variableName: string;
  variableType: string | null;
}

const CreateFlow = ({ itemId }: { itemId: string }) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [workflowTitle, setWorkflowTitle] = useState<string>("");
  const [workflowDescription, setWorkflowDescription] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [workflowVariables, setWorkflowVariables] = useState<
    { id: string; variableName: string; variableType: string | null }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    if (!itemId) {
      return setDialogBoxMsg("No item id provided.", AlertMsgType.ERROR);
    }
    if (!workflowTitle) {
      return setDialogBoxMsg("Title is required.", AlertMsgType.ERROR);
    }

    const transformedVars: Record<string, string> = {};
    let variableNameErr = false;
    let variableTypeErr = false;

    for (let i = 0; i < workflowVariables.length; i++) {
      const { variableName, variableType } = workflowVariables[i];
      if (!variableName) {
        variableNameErr = true;
        break;
      }
      if (!variableType) {
        variableTypeErr = true;
        break;
      }
      transformedVars[variableName] = variableType;
    }

    if (variableNameErr) {
      return setDialogBoxMsg("Enter variable name.", AlertMsgType.ERROR);
    }

    if (variableTypeErr) {
      return setDialogBoxMsg("Enter variable type.", AlertMsgType.ERROR);
    }

    try {
      setIsLoading(true);

      const { error } = await workflowApi.createWorkflow(
        itemId,
        workflowTitle,
        workflowDescription,
        "",
        categories,
        transformedVars,
      );

      if (error) {
        console.error(error);
        return setDialogBoxMsg(String(error), AlertMsgType.ERROR);
      }

      setDialogBoxMsg("Workflow created successfully!", AlertMsgType.SUCCESS);
    } catch (error) {
      console.error(error);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MaxWidthContainer>
      <Stack pb="xs" gap="xs">
        <WorkflowVariables setWorkflowVariables={setWorkflowVariables} />
        <NewItemBase
          itemTitle={workflowTitle}
          itemDescription={workflowDescription}
          categories={categories}
          setItemTitle={setWorkflowTitle}
          setItemDescription={setWorkflowDescription}
          setCategories={async (tags) => setCategories(tags)}
        />
        {/* <TextBox
          pt="0"
          title="Title"
          placeholder="Enter Workflow Title.."
          value={workflowTitle}
          onChange={(val) => setWorkflowTitle(val)}
        />
        <TextAreaBox
          rows={5}
          title="Description"
          placeholder="Enter Workflow Description.."
          value={workflowDescription}
          onChange={(val) => setWorkflowDescription(val)}
        /> */}
        <SubmitButton
          label="Create"
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </Stack>
    </MaxWidthContainer>
  );
};

export default CreateFlow;
