import { Box, Button } from "@mantine/core";

interface ButtonGroupType {
  loading?: boolean;
  primaryDisabled?: boolean;
  secondaryDisabled?: boolean;
  primaryText?: string;
  secondaryText?: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export const ButtonGroup = ({
  loading,
  primaryDisabled,
  secondaryDisabled,
  primaryText,
  secondaryText,
  onPrimaryClick,
  onSecondaryClick,
}: ButtonGroupType) => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        // padding: "10px",
      }}
    >
      <Button
        variant="default"
        onClick={onSecondaryClick}
        disabled={loading || secondaryDisabled}
      >
        {secondaryText ?? "Cancel"}
      </Button>
      <Button
        variant="default"
        onClick={loading ? () => {} : onPrimaryClick}
        loading={loading}
        disabled={primaryDisabled}
        style={{ marginLeft: "10px" }}
      >
        {primaryText ?? "Add"}
      </Button>
    </Box>
  );
};
