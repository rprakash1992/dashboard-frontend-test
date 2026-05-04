import { useEffect, useState } from "react";
import { Box, Button, Group, Input, Textarea } from "@mantine/core";

import { useStore } from "../../store";
import { modelSchemaApi } from "../../apiActions/modelSchemaApi";
import { Label } from "../common/Label/Label";
import { AlertMsgType } from "../../store/actionSlice";

const { insertModelSchemas, fetchAllModelSchemas } = modelSchemaApi;

const NewModelType = () => {
  const modelSchemas = useStore((state) => state.modelSchemas);
  const setModelSchemas = useStore((state) => state.setModelSchemas);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [loadingSaveModelSchema, setLoadingSaveModelSchema] =
    useState<boolean>(false);
  const [schema, setSchema] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    fetchModelSchemas();
  }, []);

  const fetchModelSchemas = async () => {
    const { data, error } = await fetchAllModelSchemas();

    if (error) {
      setDialogBoxMsg("Error while fetching model schemas.", AlertMsgType.ERROR);
    } else {
      setModelSchemas(data);
    }
  };

  const saveModel = async () => {
    setLoadingSaveModelSchema(true);
    const postData = {
      title,
      schema: JSON.parse(schema),
    };

    const { data: modelSchemaData, error: modelSchemaErr } =
      await insertModelSchemas([postData]);

    if (modelSchemaErr) {
      setDialogBoxMsg("Sonething went wrong. Please try again.", AlertMsgType.ERROR);
      setLoadingSaveModelSchema(false);
      return;
    }

    if (modelSchemaData && modelSchemaData.length > 0) {
      const newSchema = modelSchemaData[0];
      setModelSchemas([...modelSchemas, newSchema]);
      setDialogBoxMsg("Model Schema added successfully.", AlertMsgType.SUCCESS);
    }

    setLoadingSaveModelSchema(false);
    setTitle("");
    setSchema("");
  };

  return (
    <Box style={{ width: "100%", height: "100%" }}>
      {/* <ScrollArea h={height - (173 + heightOffset)}> */}
      <Box p="xs" pb="0">
        <Label label="Title" />
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Box>
      <Box p="xs" pb="0">
        <Label label="Schema" />
        <Textarea
          autosize
          minRows={5}
          placeholder="Type or paste JSON schema here.."
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
        />
      </Box>
      {/* </ScrollArea> */}
      <Group justify="flex-end" mt={10} mr={10}>
        <Button variant="default" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={saveModel} disabled={loadingSaveModelSchema}>
          Save
        </Button>
      </Group>
    </Box>
  );
};

export default NewModelType;
