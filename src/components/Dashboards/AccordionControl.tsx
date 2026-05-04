import {
  Accordion,
  Center,
  Flex,
  Group,
  Text,
  type AccordionControlProps,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  VCNewFileIcon,
  VCNewProjectIcon,
  VCNewReportIcon,
  VCNewViewIcon,
  VCNewWorkspaceIcon,
} from "../../assets/icons";
import { IconRenderer } from "../IconRenderer/IconRenderer";

interface MyAccordionControlProps extends AccordionControlProps {
  title: string;
  icon: any;
  newIconTitle: string;
  dashboardItemId: string;
  openInputBox: (e: any) => void;
  onNewItemBtnClick: (e: any) => void;
}

const newItemIcons: any = {
  file: VCNewFileIcon,
  project: VCNewProjectIcon,
  report: VCNewReportIcon,
  workspace: VCNewWorkspaceIcon,
};

export const AccordionControl = ({
  icon: Icon,
  newIconTitle,
  dashboardItemId,
  openInputBox,
  onNewItemBtnClick,
  ...props
}: MyAccordionControlProps) => {
  const { hovered, ref } = useHover();

  const NewItemIcon = newItemIcons[dashboardItemId];

  return (
    <Center ref={ref}>
      <Accordion.Control
        h="49px"
        icon={
          <Icon
            size={20}
            stroke={1.5}
            // color="var(--mantine-color-dimmed)"
          />
        }
        {...props}
      >
        <Flex direction={"row"} align="center" justify="space-between" w="100%">
          <Text>{props.title}</Text>
          {hovered && (
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
              {/* <Tooltip label="New View">
                <VCNewViewIcon size={22} onClick={openInputBox} stroke={1} />
              </Tooltip> */}
              {/* {NewItemIcon && (
                <Tooltip label={newIconTitle}>
                  <NewItemIcon
                    size={22}
                    stroke={1}
                    onClick={onNewItemBtnClick}
                  />
                </Tooltip>
              )} */}
            </Group>
          )}
        </Flex>
      </Accordion.Control>
    </Center>
  );
};
