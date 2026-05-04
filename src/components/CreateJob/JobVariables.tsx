import { Box, Flex, Select, Textarea, TextInput } from "@mantine/core";
import { Label } from "../common/Label/Label";
import type { WorkflowVariableType } from "../CreateFlow/CreateFlow";

const FieldType = ({
  variableType,
  value,
  onChange,
}: {
  variableType: string | null;
  value: any;
  onChange: (val: any) => void;
}) => {
  if (variableType === "text") {
    return (
      <TextInput value={value} onChange={(e) => onChange(e.target.value)} />
    );
  }
  if (variableType === "number") {
    return (
      <TextInput
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (variableType === "boolean") {
    return (
      <Select data={["true", "false"]} value={value} onChange={onChange} />
    );
  }
  if (variableType === "object") {
    return (
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} />
    );
  }
  return <TextInput value={value} onChange={(e) => onChange(e.target.value)} />;
};

// const OneVariable = ({
//   variableName,
//   variableType,
// }: {
//   variableName: string;
//   variableType: string | null;
// }) => {
//   return (
//     <Flex>
//       <Label label={variableName} />
//       <FieldType variableType={variableType} />
//     </Flex>
//   );
// };

export const JobVariables = ({
  variables,
  variableValues,
  updateVariableValues,
}: {
  variables: WorkflowVariableType[];
  variableValues: Record<string, any>;
  updateVariableValues: (variableName: string, variableValue: any) => void;
}) => {
  return (
    <Box>
      <Label label="Variables" />
      <Flex direction="column" gap="xs">
        {variables.map((variable) => (
          <Flex direction="row" align="center" gap="xs">
            <Box style={{ flex: 1 }}>
              <Label label={variable.variableName} />
            </Box>
            <Box style={{ flex: 1 }}>
              <FieldType
                variableType={variable.variableType}
                value={variableValues[variable.variableName]}
                onChange={(updatedVal: any) =>
                  updateVariableValues(variable.variableName, updatedVal)
                }
              />
            </Box>
          </Flex>
          // <OneVariable
          //   key={variable.id}
          //   variableName={variable.variableName}
          //   variableType={variable.variableType}
          // />
        ))}
      </Flex>
    </Box>
  );
};
