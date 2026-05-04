import { withJsonFormsControlProps } from "@jsonforms/react";
import type { ControlProps } from "@jsonforms/core";
import { RadioGroup } from "../../CustomComponents/RadioGroup";

const RadioGroupControl = (props: ControlProps) => {
  const { data, handleChange, path, schema } = props;
  const { title, enum: myEnums } = schema;

  return (
    <RadioGroup
      title={title}
      enums={myEnums || []}
      value={data}
      onChange={(val) => handleChange(path, val)}
    />
  );
};

export default withJsonFormsControlProps(RadioGroupControl);
