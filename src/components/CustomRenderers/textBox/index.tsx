import { withJsonFormsControlProps } from "@jsonforms/react";
import type { ControlProps } from "@jsonforms/core";
import { TextBox } from "../../CustomComponents/TextBox";

const TextBoxControl = (props: ControlProps) => {
  const { data, handleChange, path, schema } = props;
  const { title } = schema;

  return (
    <TextBox
      title={title}
      value={data}
      onChange={(val) => handleChange(path, val)}
    />
  );
};

export default withJsonFormsControlProps(TextBoxControl);
