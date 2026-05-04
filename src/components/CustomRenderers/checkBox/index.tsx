import { withJsonFormsControlProps } from "@jsonforms/react";
import type { ControlProps } from "@jsonforms/core";

import { CheckBox } from "../../CustomComponents/CheckBox";

const CheckBoxControl = (props: ControlProps) => {
  const { data, handleChange, path, schema } = props;
  const { title } = schema;

  return (
    <CheckBox
      label={title || ""}
      checked={data}
      onChange={(checked) => handleChange(path, checked)}
    />
  );
};

export default withJsonFormsControlProps(CheckBoxControl);
