import { withJsonFormsControlProps } from "@jsonforms/react";
import type { ControlProps } from "@jsonforms/core";
import { TextAreaBox } from "../../CustomComponents/TextArea";

const TextAreaBoxControl = (props: ControlProps) => {
  const { data, handleChange, path, schema } = props;
  const { title } = schema;

  return (
    <TextAreaBox
      title={title}
      value={data}
      rows={5}
      onChange={(val) => handleChange(path, val)}
    />
  );
};

export default withJsonFormsControlProps(TextAreaBoxControl);
