import { SegmentedControl, ThemeIcon, Tooltip } from "@mantine/core";
import { IconLayoutGrid, IconList } from "@tabler/icons-react";
import { useCustomColors } from "../../customHooks/useCustomColors";
import { useViewActions } from "../../customHooks/useViewActions";
import type { ViewItemPropertyType } from "../../store/viewSlice";

export const ViewAsControl = ({
  activeView,
  isDisabled,
}: {
  activeView: ViewItemPropertyType;
  isDisabled: boolean;
}) => {
  const { updateViewAs } = useViewActions();
  const { borderColor } = useCustomColors();

  return (
    <SegmentedControl
      style={{ padding: 0 }}
      styles={{
        root: {
          border: `1px solid ${borderColor}`, // Add border around the control
          borderRadius: "6px", // Optional: Add rounded corners
          overflow: "hidden", // Ensures the border surrounds both segments cleanly
          backgroundColor: "transparent",
        },
        label: {
          padding: "0 6px", // Adjust padding for the icons
        },
        control: {
          border: "none", // Remove the default border between the segments
        },
      }}
      value={activeView?.view_as}
      onChange={(val) => updateViewAs(activeView.id, val)}
      data={[
        {
          value: "grid",
          label: (
            <Tooltip label="Grid" position="bottom">
              <ThemeIcon size="md" variant="subtle" color="dark" title="Grid">
                <IconLayoutGrid size={20} />
              </ThemeIcon>
            </Tooltip>
          ),
        },
        {
          value: "table",
          label: (
            <Tooltip label="Table" position="bottom">
              <ThemeIcon size="md" variant="subtle" color="dark" title="Table">
                <IconList size={20} />
              </ThemeIcon>
            </Tooltip>
          ),
        },
      ]}
      disabled={isDisabled}
      size="xs"
    />
  );
};
