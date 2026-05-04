import {
  Group,
  Text,
  Button,
  Box,
  Card,
  useMantineColorScheme,
} from "@mantine/core";
import { formatDateToString } from "../../utils/misc";
import { IconRenderer } from "../IconRenderer/IconRenderer";
// import type { ItemMetadataType } from "../../../types";
import {
  VCNewReportIcon,
  VCEyeIcon,
  VCProjectIcon,
  VCFileIcon,
  VCJobsIcon,
  VCReportIcon,
  VCWorkflowIcon,
} from "../../assets/icons";

interface RelatedItemsType {
  data: any;
  disabledBtn: boolean;
  selectedItemType: string;
  addNewReport: () => void;
}

export const RelatedItems = ({
  data,
  // disabledBtn,
  selectedItemType,
  addNewReport,
}: RelatedItemsType) => {
  const { colorScheme } = useMantineColorScheme();
  const isProjectItem = selectedItemType === "project";

  const handleOpenReport = async () => {};

  const getIcon = (itemType: string) => {
    if (itemType === "project") {
      return VCProjectIcon;
    } else if (itemType === "file") {
      return VCFileIcon;
    } else if (itemType === "report") {
      return VCReportIcon;
    } else if (itemType === "job") {
      return VCJobsIcon;
    } else if (itemType === "workflow") {
      return VCWorkflowIcon;
    } else {
      return VCProjectIcon;
    }
  };

  return (
    <Box p="10px">
      {data?.length > 0 ? (
        data.map((ele: any) => (
          <Card
            key={ele?.id}
            shadow="xs"
            radius="sm"
            p="xs"
            mb="10px"
            withBorder
          >
            <Group justify="space-between">
              <Group>
                <IconRenderer icon={getIcon(ele?.item_type)} />
                <div>
                  <Text>{ele?.title}</Text>
                  <Text size="xs" c="dimmed" fw={500}>
                    {formatDateToString(ele?.created_at)}
                  </Text>
                </div>
              </Group>
              {ele?.itemType === "report" && (
                <span title="Open Report">
                  <VCEyeIcon
                    cursor="pointer"
                    color={colorScheme === "dark" ? "#fff" : "#000"}
                    onClick={() => handleOpenReport()}
                  />
                </span>
              )}
            </Group>
          </Card>
        ))
      ) : (
        <Group justify="center" align="cemter">
          No items found.
        </Group>
      )}
      {isProjectItem && (
        <Box style={{ width: "100%" }}>
          <Button
            // disabled={disabledBtn}
            disabled={true}
            leftSection={<VCNewReportIcon size="1rem" />}
            onClick={addNewReport}
            style={{ width: "100%" }}
          >
            Create New Report
          </Button>
        </Box>
      )}
    </Box>
  );
};
