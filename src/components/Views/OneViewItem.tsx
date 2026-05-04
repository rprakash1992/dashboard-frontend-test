import { useState } from "react";
import { useHover } from "@mantine/hooks";
import { Box, Group, List, Text, TextInput, Tooltip } from "@mantine/core";
import {
  VCCloseIcon,
  VCEditIcon,
  VCPinFilledIcon,
  VCPinIcon,
} from "../../assets/icons";
import { useCustomColors } from "../../customHooks/useCustomColors";

interface OneViewItemProps {
  title: string;
  active: boolean;
  pinned: boolean;
  selectView: () => void;
  togglePinView: () => void;
  renameView: (newTitle: string) => void;
}

export const OneViewItem = ({
  title,
  active,
  pinned,
  selectView,
  togglePinView,
  renameView,
}: OneViewItemProps) => {
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [newViewTitle, setNewViewTitle] = useState<string>("");
  const { hovered, ref } = useHover();
  const { hoverColor, borderColor } = useCustomColors();
  const excludedItem =
    title?.toLowerCase() === "all" ||
    title?.toLowerCase() === "uploads" ||
    title?.toLowerCase() === "workflows";

  const Icon = pinned ? VCPinFilledIcon : VCPinIcon;
  const iconLabel = pinned ? "Unpin" : "Pin";

  const onPinClick = (e: any) => {
    e.stopPropagation();
    togglePinView();
  };

  const onRenameClick = (e: any) => {
    e.stopPropagation();
    setIsRenaming(true);
    setNewViewTitle(title);
  };

  const onCloseClick = () => {
    setIsRenaming(false);
    setNewViewTitle("");
  };

  const submitRenameView = (e: any) => {
    if (e.key === "Escape") {
      setIsRenaming(false);
    }
    if (e.key === "Enter") {
      renameView(newViewTitle);
      setNewViewTitle("");
      setIsRenaming(false);
    }
  };

  return (
    <List.Item
      styles={{
        itemWrapper: {
          width: "100%",
        },
        itemLabel: {
          display: "block",
          width: "100%",
        },
        item: {
          borderTop: `1px solid ${borderColor}`,
        },
      }}
      // h="32px"
      h="36px"
      style={{
        cursor: "pointer",
        backgroundColor: active ? hoverColor : "unset",
      }}
    >
      {isRenaming ? (
        <Group
          // h="32px"
          // h="36px"
          // px="5px"
          align="center"
          justify="space-between"
          gap="0"
        >
          <Box style={{ display: "flex", flex: 1 }}>
            <TextInput
              styles={{
                root: { width: "100%" },
                input: {
                  // height: "30px",
                  height: "34px",
                  // minHeight: "30px",
                  minHeight: "34px",
                  borderRadius: 0,
                  // borderTopRightRadius: "0",
                  // borderBottomRightRadius: "0",
                },
              }}
              placeholder="Enter New Title.."
              value={newViewTitle}
              onChange={(e) => setNewViewTitle(e.target.value)}
              onKeyUp={submitRenameView}
              autoFocus
            />
          </Box>
          <Box
            style={{
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${borderColor}`,
              borderLeft: "none",
              cursor: "pointer",
              borderRadius: 0,
              // borderTopRightRadius: "4px",
              // borderBottomRightRadius: "4px",
            }}
          >
            {/* <VCCloseIcon
              cursor="pointer"
              onClick={() => setShowNewViewInputBox(false)}
            /> */}
            <VCCloseIcon cursor="pointer" onClick={onCloseClick} />
          </Box>
        </Group>
      ) : (
        <Group
          ref={ref}
          // h="32px"
          h="36px"
          px="15px"
          align="center"
          justify="space-between"
          onClick={selectView}
          style={{
            backgroundColor: active || hovered ? hoverColor : "unset",
            cursor: "pointer",
          }}
        >
          <Text size="0.875rem">{title}</Text>
          {hovered && !excludedItem && (
            <Group gap="2px" justify="center" align="center">
              <Tooltip label="Rename">
                <VCEditIcon size={22} stroke={1} onClick={onRenameClick} />
              </Tooltip>
              <Tooltip label={iconLabel}>
                <Icon size={22} stroke={1} onClick={onPinClick} />
              </Tooltip>
            </Group>
          )}
        </Group>
      )}
    </List.Item>
  );
};
