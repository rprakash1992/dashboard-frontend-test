import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ComponentType,
} from "react";
import { JsonFormsDispatch, withJsonFormsContext } from "@jsonforms/react";
import {
  composePaths,
  findUISchema,
  Resolve,
  getFirstPrimitiveProp,
  createId,
  removeId,
  type JsonFormsRendererRegistryEntry,
  type JsonSchema,
  type JsonFormsCellRendererRegistryEntry,
  type JsonFormsUISchemaRegistryEntry,
  type ControlElement,
  type ArrayTranslations,
} from "@jsonforms/core";
import { Accordion, ActionIcon, Avatar, Group, Text } from "@mantine/core";
import get from "lodash.get";

import { VCTrashIcon } from "../../../assets/icons";

interface OwnPropsOfExpandPanel {
  enabled: boolean;
  index: number;
  path: string;
  uischema: ControlElement;
  schema: JsonSchema;
  expanded: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
  uischemas?: JsonFormsUISchemaRegistryEntry[];
  rootSchema: JsonSchema;
  enableMoveUp: boolean;
  enableMoveDown: boolean;
  config: any;
  childLabelProp?: string;
  handleExpansion(panel: string): (event: any, expanded: boolean) => void;
  translations: ArrayTranslations;
  removeItems(path: string, toDelete: number[]): () => void;
}

interface StatePropsOfExpandPanel extends OwnPropsOfExpandPanel {
  childLabel: string;
  childPath: string;
  enableMoveUp: boolean;
  enableMoveDown: boolean;
}

export interface ExpandPanelProps extends StatePropsOfExpandPanel {}

const RendererComponent = (props: ExpandPanelProps) => {
  const [labelHtmlId] = useState<string>(createId("expand-panel"));

  const removeItemsCb = useCallback(
    (path: string, toDelete: number[]) => {
      return removeItems ? removeItems(path, toDelete) : () => {};
    },
    [props.removeItems]
  );

  useEffect(() => {
    return () => {
      removeId(labelHtmlId);
    };
  }, [labelHtmlId]);

  const {
    enabled,
    childPath,
    index,
    removeItems,
    path,
    rootSchema,
    schema,
    uischema,
    uischemas,
    renderers,
    cells,
  } = props;

  const foundUISchema = useMemo(
    () =>
      findUISchema(
        uischemas || [],
        schema,
        uischema.scope,
        path,
        undefined,
        uischema,
        rootSchema
      ),
    [uischemas, schema, uischema.scope, path, uischema, rootSchema]
  );

  return (
    <Accordion>
      <Accordion.Item value={childPath}>
        <Accordion.Control>
          <Group justify="space-between" align="center" pr="sm">
            <Avatar>{index + 1}</Avatar>
            <Text>{schema.title}</Text>
            <ActionIcon size={24} onClick={removeItemsCb(path, [index])}>
              <VCTrashIcon />
            </ActionIcon>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <JsonFormsDispatch
            enabled={enabled}
            schema={schema}
            uischema={foundUISchema}
            path={childPath}
            key={childPath}
            renderers={renderers}
            cells={cells}
          />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export const ExpandPanelRenderer = React.memo(RendererComponent);

/**
 * Maps state to dispatch properties of an expand pandel control.
 *
 * @param dispatch the store's dispatch method
 * @returns {DispatchPropsOfArrayControl} dispatch props of an expand panel control
 */

/**
 * Map state to control props.
 * @param state the JSON Forms state
 * @param ownProps any own props
 * @returns {StatePropsOfControl} state props for a control
 */
export const withContextToExpandPanelProps = (Component: any): any =>
  function WithContextToExpandPanelProps({ ctx, props }: any) {
    const { childLabelProp, schema, path, index, uischemas } = props;
    const childPath = composePaths(path, `${index}`);
    const childData = Resolve.data(ctx.core.data, childPath);
    const childLabel = childLabelProp
      ? get(childData, childLabelProp, "")
      : get(childData, getFirstPrimitiveProp(schema), "");

    return (
      <Component
        {...props}
        childLabel={childLabel}
        childPath={childPath}
        uischemas={uischemas}
      />
    );
  };

export const withJsonFormsExpandPanelProps = (
  Component: ComponentType<ExpandPanelProps>
): ComponentType<OwnPropsOfExpandPanel> =>
  withJsonFormsContext(withContextToExpandPanelProps(Component));

export default withJsonFormsExpandPanelProps(ExpandPanelRenderer);
