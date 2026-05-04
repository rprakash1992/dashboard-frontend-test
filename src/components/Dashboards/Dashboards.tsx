import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Accordion, Box } from "@mantine/core";
import {
  VCFileIcon,
  VCJobsIcon,
  VCProjectIcon,
  VCReportIcon,
  VCUserProfilesIcon,
  VCWorkflowIcon,
  VCWorkspaceIcon,
} from "../../assets/icons";
import { useStore } from "../../store";
import type { ViewItemPropertyType } from "../../store/viewSlice";
import { RouteItemTypesEnums } from "../../data/gui/RouteEnums";
import { OneDashboardItem } from "./OneDashboardItem";
import { ItemTitle } from "../common/ItemTitle/ItemTitle";

export const newItemDetails: any = {
  file: {
    id: "new_file",
    title: "New File",
  },
  project: {
    id: "new_project",
    title: "New Project",
  },
  report: {
    id: "new_report",
    title: "New Report",
  },
  workspace: {
    id: "new_workspace",
    title: "New Workspace",
  },
  user_profile: {
    id: "new_user_profile",
    title: "New User Profile",
  },
  role: {
    id: "new_role",
    title: "New Item Role",
  },
};

const leftSideNavItems = [
  {
    id: "file",
    label: "Files",
    route: "/files",
    icon: VCFileIcon,
    itemType: "file",
  },
  {
    id: "project",
    label: "Projects",
    route: "/projects",
    icon: VCProjectIcon,
    itemType: "project",
  },
  {
    id: "report",
    label: "Reports",
    route: "/reports",
    icon: VCReportIcon,
    itemType: "report",
  },
  {
    id: "workspace",
    label: "Workspaces",
    route: "/workspaces",
    icon: VCWorkspaceIcon,
    itemType: "workspace",
  },
  {
    id: "user_profile",
    label: "Users",
    route: "/users",
    icon: VCUserProfilesIcon,
    itemType: "user_profile",
  },
  {
    id: "workflow",
    label: "Workflows",
    route: "/workflows",
    icon: VCWorkflowIcon,
    itemType: "workflow",
  },
  {
    id: "job",
    label: "Jobs",
    route: "/jobs",
    icon: VCJobsIcon,
    itemType: "job",
  },
  // {
  //   id: "roles",
  //   label: "Roles",
  //   route: "/roles",
  // },
];

const Dashboards = () => {
  const viewProperties = useStore((state) => state.viewProperties);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const defaultAccordionVal = RouteItemTypesEnums[pathname] ?? "file";
  const [accordionItemId, setAccordionItemId] = useState<string | null>(
    defaultAccordionVal,
  );

  const onNewIconClick = (itemId: any, itemTitle: any) => {
    const getRoute: any = {
      new_file: "/new-file",
      new_project: "/new-project",
      new_report: "/new-report",
      new_workspace: "/new-workspace",
    };
    const route = getRoute[itemId];
    navigate(`${route}?tabId=${itemId}&tabTitle=${itemTitle}`);
  };

  const onViewClick = (
    route: string | undefined,
    viewId: string,
    viewTitle: string,
  ) => {
    navigate(`${route}?tabId=${viewId}&tabTitle=${viewTitle}&itemId=${viewId}`);
  };

  return (
    <Box>
      <Box p="10px">
        <ItemTitle title="Dashboards" />
      </Box>
      <Accordion
        chevronPosition="right"
        // defaultValue={defaultAccordionVal}
        value={accordionItemId}
        onChange={setAccordionItemId}
      >
        {leftSideNavItems.map((item) => (
          <OneDashboardItem
            key={item.id}
            dashboardItemId={item.id}
            title={item.label}
            icon={item.icon}
            childItems={viewProperties
              .filter((view) => view.item_type === item.id)
              .sort((item1, item2) => Number(item1.id) - Number(item2.id))}
            onNewIconClick={() =>
              onNewIconClick(
                newItemDetails[item.id].id,
                newItemDetails[item.id].title,
              )
            }
            onViewClick={(view: ViewItemPropertyType) =>
              onViewClick(item.route, view.id, view.title)
            }
            setAccordionItemId={setAccordionItemId}
          />
        ))}
      </Accordion>
    </Box>
  );
};

export default Dashboards;
