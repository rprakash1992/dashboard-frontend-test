import { useEffect, useState } from "react";
import { Box, Select, Stack } from "@mantine/core";
import { JsonForms } from "@jsonforms/react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";

import { useStore } from "../../store";
import {
  SearchOrDropTester,
  InputBoxTester,
  CheckBoxTester,
  TextAreaBoxTester,
  RadioGroupTester,
  ArrayLayoutTester,
} from "../CustomRenderers/testers";
import TextBoxControl from "../CustomRenderers/textBox";
import CheckBoxControl from "../CustomRenderers/checkBox";
import TextAreaBoxControl from "../CustomRenderers/textArea";
import RadioGroupControl from "../CustomRenderers/radioGroup";
import SearchOrDropControl from "../CustomRenderers/searchOrDrop";
import ArrayControl from "../CustomRenderers/arrayLayout";
import { modelSchemaApi } from "../../apiActions/modelSchemaApi";
import { projectApi } from "../../apiActions/projectApi";
import { SubmitButton } from "../common/SubmitButton/SubmitButton";
import { Label } from "../common/Label/Label";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { AlertMsgType } from "../../store/actionSlice";
import type { ItemMetadataType } from "../../types";
import { NewItemBase } from "../NewItemBase/NewItemBase";

const renderers = [
  ...materialRenderers,
  //register custom renderers
  { tester: InputBoxTester, renderer: TextBoxControl },
  { tester: CheckBoxTester, renderer: CheckBoxControl },
  { tester: TextAreaBoxTester, renderer: TextAreaBoxControl },
  { tester: RadioGroupTester, renderer: RadioGroupControl },
  { tester: ArrayLayoutTester, renderer: ArrayControl },
  { tester: SearchOrDropTester, renderer: SearchOrDropControl },
];

interface SchemaType {
  schema: any;
  uiSchema: any;
  data: any;
}

interface NewProjectItemType {
  title: string;
  fileSourceItem: ItemMetadataType;
}

const NewProject = () => {
  const projectSchemas = useStore((state) => state.modelSchemas);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const setProjectSchemas = useStore((state) => state.setModelSchemas);
  const addReloadComponent = useStore((state) => state.addReloadComponent);
  const [newProjectItem, setNewProjectItem] = useState<NewProjectItemType>({
    title: "New Project",
    fileSourceItem: {},
  } as NewProjectItemType);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSchema, setSelectedSchema] = useState<string>("");
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [schemas, setSchemas] = useState<SchemaType>({
    schema: {},
    uiSchema: {},
    data: {},
  });
  const [data, setData] = useState<any>({});
  const [description, setDescription] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProjectSchemas();
  }, []);

  useEffect(() => {
    const projectTypesArray: string[] = [];
    const schemasObj: any = {};

    if (projectSchemas && projectSchemas.length > 0) {
      projectSchemas.forEach((schemaItem) => {
        const { title, schema, ui_schema, data } = schemaItem;
        projectTypesArray.push(title);
        schemasObj[title] = { schema, uiSchema: ui_schema, data };
      });

      setProjectTypes(projectTypesArray);
      setSchemas(schemasObj);
      setSelectedSchema("CAX Project");
      setData(schemasObj["CAX Project"]?.data);
    }
  }, [projectSchemas]);

  useEffect(() => {
    setData(schemas[selectedSchema as keyof SchemaType]?.data);
  }, [selectedSchema]);

  useEffect(() => {
    if (data?.fileSource?.item?.id) {
      // setDataAndModelItem();
      setNewProjectItem({
        ...newProjectItem,
        fileSourceItem: data?.fileSource?.item,
      });
    }
  }, [data?.fileSource]);

  useEffect(() => {
    setNewProjectItem({
      ...newProjectItem,
      title: data?.title,
    });
  }, [data?.title]);

  // const setDataAndModelItem = async () => {
  // const itemId: string = data?.fileSource?.id;
  // const { data: metadataData, error: metadataError } =
  //   await itemApi?.fetchMetadatasByIds([itemId]);
  // if (metadataError) {
  //   setDialogBoxMsg(
  //     "Error while fetching file source. Please try again.",
  //     "error"
  //   );
  // } else {
  //   const item = metadataData[0];
  //   setData({
  //     ...data,
  //     title: item?.title,
  //   });
  //   setNewProjectItem({
  //     ...newProjectItem,
  //     fileSourceItem: item,
  //   });
  // }
  // };

  const fetchProjectSchemas = async () => {
    try {
      const { error, data } = await modelSchemaApi?.fetchAllModelSchemas();

      if (error) {
        setIsLoading(false);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (data && data?.length > 0) {
        setProjectSchemas(data);
      }
      setIsLoading(false);
    } catch (error) {
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    }
  };

  const handleAddItem = async () => {
    if (!selectedSchema) {
      return setDialogBoxMsg("Select project type.", AlertMsgType.ERROR);
    }

    if (!newProjectItem?.title) {
      return setDialogBoxMsg("Enter Project title.", AlertMsgType.ERROR);
    }

    if (!newProjectItem?.fileSourceItem?.id) {
      return setDialogBoxMsg("Select a file source", AlertMsgType.ERROR);
    }

    try {
      setIsBtnLoading(true);

      const { error: projectErr } = await projectApi.insertProject(
        newProjectItem.title,
        description,
        "",
        categories,
        data.fileSource.id,
        data,
      );

      if (projectErr) {
        console.error(projectErr);
        return setDialogBoxMsg(projectErr, AlertMsgType.ERROR);
      }

      setNewProjectItem({
        title: "New Project",
        fileSourceItem: {} as ItemMetadataType,
      });
      setData(schemas[selectedSchema as keyof SchemaType]?.data);
      setDescription("");
      setCategories([]);
      setDialogBoxMsg("Project added.", AlertMsgType.SUCCESS);
      addReloadComponent("project");
    } catch (error) {
      console.error(error, "error");
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setIsBtnLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MaxWidthContainer>
        <LoadingComponent />
      </MaxWidthContainer>
    );
  }

  return (
    <MaxWidthContainer>
      <Stack p="xs" gap="xs">
        <Box>
          <Label label="Project Type" />
          <Select
            value={selectedSchema}
            onChange={(val) => setSelectedSchema(val as string)}
            data={projectTypes}
            checkIconPosition="right"
          />
        </Box>
        {selectedSchema && data && Object.keys(data)?.length > 0 && (
          <JsonForms
            schema={schemas[selectedSchema as keyof SchemaType].schema}
            data={data}
            renderers={renderers}
            cells={materialCells}
            onChange={({ data: newData }) => setData(newData)}
          />
        )}
        <NewItemBase
          withoutTitle
          itemTitle={""}
          itemDescription={description}
          categories={categories}
          setItemTitle={() => {}}
          setItemDescription={setDescription}
          setCategories={async (tags) => setCategories(tags)}
        />
        <SubmitButton
          label="Add"
          onSubmit={handleAddItem}
          isLoading={isBtnLoading}
        />
      </Stack>
    </MaxWidthContainer>
  );
};

export default NewProject;
