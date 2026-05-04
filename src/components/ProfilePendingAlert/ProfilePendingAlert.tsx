import { Alert, Box } from "@mantine/core";
import { VCInfoIcon } from "../../assets/icons";
import { useStore } from "../../store";

interface ProfilePendingAlertProps {
  title: string;
  icon?: any;
  color?: string;
  content: string;
  variant?:
    | "light"
    | "filled"
    | "outline"
    | "transparent"
    | "while"
    | "default";
}

export const ProfilePendingAlert = ({
  title = "Profile Pending",
  icon = <VCInfoIcon />,
  content,
  variant = "default",
  color = "blue",
}: ProfilePendingAlertProps) => {
  const setShowBottomStickyAlert = useStore(
    (state) => state.setShowBottomStickyAlert,
  );
  const showBottomStickyAlert = useStore(
    (state) => state.showBottomStickyAlert,
  );

  if (!showBottomStickyAlert) return null;

  return (
    <Box
      style={{
        position: "absolute",
        bottom: 10,
        left: 50,
        right: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Alert
        withCloseButton
        variant={variant}
        color={color}
        title={title}
        icon={icon}
        onClose={() => setShowBottomStickyAlert(false)}
        style={{
          padding: "10px",
        }}
      >
        {content}
      </Alert>
    </Box>
  );
};
