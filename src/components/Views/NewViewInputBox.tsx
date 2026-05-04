import { Box, Group, List, TextInput } from "@mantine/core";

import { VCCloseIcon } from "../../assets/icons";
import { useCustomColors } from "../../customHooks/useCustomColors";

interface NewViewInputBoxProps {
  newViewTitle: string;
  setNewViewTitle: (title: string) => void;
  setShowNewViewInputBox: (show: boolean) => void;
  submitNewView: (e: any) => void;
}

export const NewViewInputBox = ({
  newViewTitle,
  setNewViewTitle,
  setShowNewViewInputBox,
  submitNewView,
}: NewViewInputBoxProps) => {
  const { borderColor } = useCustomColors();

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
      }}
      h="36px"
      // px="xs"
    >
      <Group align="center" justify="space-between" gap="0">
        <Box style={{ display: "flex", flex: 1 }}>
          <TextInput
            styles={{
              root: { width: "100%" },
              input: {
                height: "34px",
                minHeight: "34px",
                borderRadius: 0
                // borderTopRightRadius: "0",
                // borderBottomRightRadius: "0",
              },
            }}
            placeholder="Enter View Title.."
            value={newViewTitle}
            onChange={(e) => setNewViewTitle(e.target.value)}
            onKeyUp={submitNewView}
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
            borderRadius: 0
            // borderTopRightRadius: "4px",
            // borderBottomRightRadius: "4px",
          }}
        >
          <VCCloseIcon
            cursor="pointer"
            onClick={() => setShowNewViewInputBox(false)}
          />
        </Box>
      </Group>
    </List.Item>
  );
};
