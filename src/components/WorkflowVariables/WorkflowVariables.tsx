import { useEffect, useState } from "react";
import { Box, Button, Flex, Select, TextInput } from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import { Label } from "../common/Label/Label";
import type { WorkflowVariableType } from "../CreateFlow/CreateFlow";

const OneVariable = ({
  variableName,
  variableType,
  setVariableName,
  setVariableType,
  removeVariable,
}: {
  variableName: string;
  variableType: string | null;
  setVariableName: (name: string) => void;
  setVariableType: (varType: string | null) => void;
  removeVariable: () => void;
}) => {
  return (
    <Flex align="center" gap="xs">
      <Box style={{ flex: 1 }}>
        <TextInput
          placeholder="Enter Variable Name"
          value={variableName}
          onChange={(e) => setVariableName(e.target.value)}
        />
      </Box>
      <Box style={{ flex: 1 }}>
        <Select
          placeholder="Select Variable Type"
          value={variableType}
          data={["text", "number", "boolean", "object"]}
          onChange={setVariableType}
        />
      </Box>
      <Button variant="default" onClick={removeVariable}>
        <IconX />
      </Button>
    </Flex>
  );
};

export const WorkflowVariables = ({
  setWorkflowVariables,
}: {
  setWorkflowVariables: (variables: WorkflowVariableType[]) => void;
}) => {
  const [variables, setVariables] = useState<WorkflowVariableType[]>([]);

  useEffect(() => {
    setWorkflowVariables(variables);
  }, [variables]);

  const addVariable = () => {
    const randomId = String(Math.floor(Math.random() * 10000));
    setVariables((vars) => [
      ...vars,
      { id: randomId, variableName: "", variableType: "" },
    ]);
  };

  const updateVariableName = (variableId: string, variableName: string) => {
    setVariables((vars) =>
      vars.map((variable) =>
        variable.id === variableId ? { ...variable, variableName } : variable,
      ),
    );
  };

  const updateVariableType = (
    variableId: string,
    variableType: string | null,
  ) => {
    setVariables((vars) =>
      vars.map((variable) =>
        variable.id === variableId ? { ...variable, variableType } : variable,
      ),
    );
  };

  const removeVariable = (variableId: string) => {
    setVariables((vars) =>
      vars.filter((variable) => variable.id !== variableId),
    );
  };

  return (
    <Flex gap="xs" direction="column">
      <Flex justify="space-between" align="center">
        <Label label="Variables" />
        <Button variant="default" onClick={addVariable}>
          <IconPlus />
        </Button>
      </Flex>
      <Flex direction="column" gap="xs">
        {variables.map((variable) => (
          <OneVariable
            key={variable.id}
            variableName={variable.variableName}
            variableType={variable.variableType}
            setVariableName={(name) => updateVariableName(variable.id, name)}
            setVariableType={(varType) =>
              updateVariableType(variable.id, varType)
            }
            removeVariable={() => removeVariable(variable.id)}
          />
        ))}
      </Flex>
    </Flex>
  );
};
