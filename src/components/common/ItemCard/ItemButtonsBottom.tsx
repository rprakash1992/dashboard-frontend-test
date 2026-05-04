import { Flex } from "@mantine/core";
import {
  // VCActivityIcon,
  VCInfoIcon,
  VCTraceabilityIcon,
  // VCMessageIcon,
  VCShareIcon,
  VCSettingsIcon,
  VCUsersIcon,
  VCJobsInfoIcon,
  VCAIAssistantIcon,
  VCPermissionIcon,
} from "../../../assets/icons";
import { IconRenderer } from "../../IconRenderer/IconRenderer";
import { getWorkspaceId } from "../../../utils/getWorkspaceId";
import { useStore } from "../../../store";

export interface ItemCardBottomBtnsRegularProps {
  itemId: string;
  itemType: string;
  handleCommentClick: () => void;
  handlePropertyBtnClick: (prop: string, route: string) => void;
}

type IconType = {
  iconName: string;
  id: string;
  route: string;
  tooltip: string;
  icon: any;
};

const info: IconType = {
  iconName: "info",
  id: "item_info",
  route: "item-info",
  tooltip: "Info",
  icon: VCInfoIcon,
};

const traceability: IconType = {
  iconName: "traceability",
  id: "item_traceability",
  route: "item-traceability",
  tooltip: "Traceability",
  icon: VCTraceabilityIcon,
};

// const activity: IconType = {
//   iconName: "activity",
//   id: "activity_tab",
//   route: "item-activity",
//   tooltip: "Activity",
//   icon: VCActivityIcon,
// };

// const comment: IconType = {
//   iconName: "comment",
//   id: "comment",
//   route: "",
//   tooltip: "Comment",
//   icon: VCMessageIcon,
// };

const share: IconType = {
  iconName: "share",
  id: "item_share",
  route: "item-share",
  tooltip: "Share",
  icon: VCShareIcon,
};

const users: IconType = {
  iconName: "users",
  id: "users_tab",
  route: "workspace-users",
  tooltip: "Users",
  icon: VCUsersIcon,
};

const status: IconType = {
  iconName: "status",
  id: "user_profile_status",
  route: "user-status",
  tooltip: "Status",
  icon: VCSettingsIcon,
};

const jobInfo: IconType = {
  iconName: "jobInfo",
  id: "job_info",
  route: "job-info",
  tooltip: "Job Info",
  icon: VCJobsInfoIcon,
};

const aiAssistant: IconType = {
  iconName: "aiAssistant",
  id: "ai_assistant",
  route: "ai-assistant",
  tooltip: "AI Assistant",
  icon: VCAIAssistantIcon,
};

const permissions: IconType = {
  iconName: "permissions",
  id: "permissions",
  route: "permissions",
  tooltip: "Permissions",
  icon: VCPermissionIcon,
};

// const icons: Record<string, IconType[]> = {
//   file: [info, traceability, activity, share],
//   project: [info, traceability, activity, share, aiAssistant],
//   report: [info, traceability, activity, share],
//   workspace: [info, users],
//   user_profile: [info, status],
//   role: [info],
//   workflow: [info, traceability, activity],
//   job: [info, traceability, jobInfo],
// };

const icons: Record<string, IconType[]> = {
  file: [info, traceability, share],
  project: [info, traceability, share, aiAssistant],
  report: [info, traceability, share],
  workspace: [info, users],
  user_profile: [info, status],
  role: [info, permissions],
  workflow: [info, traceability],
  job: [info, traceability, jobInfo],
};

export const ItemButtonsBottom = ({
  itemId,
  itemType,
  handleCommentClick,
  handlePropertyBtnClick,
}: ItemCardBottomBtnsRegularProps) => {
  const myWorkspaces = useStore((state) => state.myWorkspaces);
  const userProfile = useStore((state) => state.userProfile);
  let iconsToRender = icons[itemType];
  const workspaceId = getWorkspaceId();

  const selectedWorkspace = myWorkspaces.find(
    (ws) => String(ws.id) === String(workspaceId),
  );

  const hideProfileStatusIcon =
    itemType === "user_profile" &&
    (selectedWorkspace?.system_key !== "system_administrator_workspace" ||
      String(itemId) === String(userProfile?.id));

  if (hideProfileStatusIcon) {
    iconsToRender = iconsToRender.filter(
      (icon) => icon.id !== "user_profile_status",
    );
  }

  const handleIconClick = (id: string, route: string) => {
    if (id === "comment") {
      handleCommentClick();
    } else {
      handlePropertyBtnClick(id, route);
    }
  };

  return (
    <Flex direction="row" align={"center"} gap="1px">
      {iconsToRender.map((icon) => (
        <IconRenderer
          key={icon.id}
          icon={icon.icon}
          tooltipLabel={icon.tooltip}
          onClick={() => handleIconClick(icon.id, icon.route)}
        />
      ))}
    </Flex>
  );
};
