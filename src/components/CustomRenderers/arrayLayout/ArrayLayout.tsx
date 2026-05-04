import React, { useState, useCallback } from "react";
import {
  composePaths,
  computeLabel,
  createDefaultValue,
  type ArrayLayoutProps,
  type ArrayTranslations,
} from "@jsonforms/core";
import merge from "lodash.merge";
import map from "lodash.map";
import range from "lodash.range";

import RendererComponent from "./RendererComponent";
import { ArrayLayoutToolbar } from "./ArrayToolbar";

export interface RemoveItems {
  (path: string, toDelete: number[]): () => void;
}

type ExtendedArrayLayoutProps = ArrayLayoutProps & {
  translations?: ArrayTranslations;
};

const MaterialArrayLayoutComponent = (props: ExtendedArrayLayoutProps) => {
  const [expanded, setExpanded] = useState<string | boolean>(false);
  const innerCreateDefaultValue = useCallback(
    () => createDefaultValue(props.schema, props.rootSchema),
    [props.schema]
  );
  const handleChange = useCallback(
    (panel: string) => (_event: any, expandedPanel: boolean) => {
      setExpanded(expandedPanel ? panel : false);
    },
    []
  );
  const isExpanded = (index: number) =>
    expanded === composePaths(props.path, `${index}`);

  const {
    enabled,
    data,
    path,
    schema,
    uischema,
    errors,
    addItem,
    removeItems,
    renderers,
    cells,
    label,
    rootSchema,
    config,
    uischemas,
    translations = {} as ArrayTranslations,
    description,
  } = props;
  const appliedUiSchemaOptions = merge({}, config, props.uischema.options);

  return (
    <div>
      <ArrayLayoutToolbar
        translations={translations}
        label={computeLabel(
          label,
          false,
          appliedUiSchemaOptions.hideRequiredAsterisk
        )}
        description={description || ""}
        errors={errors}
        path={path}
        enabled={enabled}
        addItem={addItem}
        createDefault={innerCreateDefaultValue}
      />
      <div>
        {data > 0 ? (
          map(range(data), (index) => {
            return (
              <RendererComponent
                enabled={enabled}
                index={index}
                expanded={isExpanded(index)}
                schema={schema}
                path={path}
                handleExpansion={handleChange}
                uischema={uischema}
                renderers={renderers}
                cells={cells}
                key={index}
                rootSchema={rootSchema}
                enableMoveUp={index !== 0}
                enableMoveDown={index < data - 1}
                config={config}
                childLabelProp={appliedUiSchemaOptions.elementLabelProp}
                uischemas={uischemas}
                translations={translations}
                removeItems={removeItems as RemoveItems}
              />
            );
          })
        ) : (
          <p>{translations.noDataMessage}</p>
        )}
      </div>
    </div>
  );
};

export const MaterialArrayLayout = React.memo(MaterialArrayLayoutComponent);
