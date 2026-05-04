import { Box } from "@mantine/core";
// import { AppHeader } from "../AppHeader/AppHeader";
import { FlexLayout } from "../FlexLayout/FlexLayout";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";
import { useAppBootstrap } from "../../customHooks/useAppBootstrap";
import { ProfilePendingAlert } from "../ProfilePendingAlert/ProfilePendingAlert";
import { useStore } from "../../store";

export const AppLayout = () => {
  const profilePending = useStore((state) => state.profilePending);
  const { loading } = useAppBootstrap();

  return (
    <Box style={{ width: "100vw", height: "100vh" }}>
      {/* <AppHeader /> */}
      <Box
        style={{
          position: "relative",
          width: "100vw",
          // height: "calc(100vh - 62px)",
          height: "100vh",
        }}
      >
        {loading ? <LoadingComponent /> : <FlexLayout />}
      </Box>
      {profilePending && (
        <ProfilePendingAlert
          title="Profile Not Active."
          content="Your profile is pending for approval. Please contact admin."
        />
      )}
    </Box>
  );
};
