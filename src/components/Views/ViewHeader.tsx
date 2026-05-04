import { Flex, Group, Text } from "@mantine/core";
import { IconRenderer } from "../IconRenderer/IconRenderer";
// import { useHover } from "@mantine/hooks";
import {
  VCNewFileIcon,
  VCNewProjectIcon,
  VCNewReportIcon,
  VCNewViewIcon,
  VCNewWorkspaceIcon,
} from "../../assets/icons";

const newItemIcons: any = {
  file: VCNewFileIcon,
  project: VCNewProjectIcon,
  report: VCNewReportIcon,
  workspace: VCNewWorkspaceIcon,
};

export const ViewHeader = ({
  title,
  itemType,
  newIconTitle,
  openInputBox,
  onNewItemBtnClick,
}: {
  title: string;
  itemType: string;
  newIconTitle: string;
  openInputBox: (e: any) => void;
  onNewItemBtnClick: (e: any) => void;
}) => {
  // const { hovered, ref } = useHover();

  const NewItemIcon = newItemIcons[itemType];

  return (
    <Flex
      // ref={ref}
      direction={"row"}
      align="center"
      justify="space-between"
      w="100%"
    >
      <Text>{title}</Text>
      {/* {hovered && ( */}
      <Group gap="1px" align="center" justify="center">
        <IconRenderer
          icon={VCNewViewIcon}
          onClick={openInputBox}
          tooltipLabel="New View"
        />
        {NewItemIcon && (
          <IconRenderer
            icon={NewItemIcon}
            onClick={onNewItemBtnClick}
            tooltipLabel={newIconTitle}
          />
        )}
      </Group>
      {/* )} */}
    </Flex>
  );
};
