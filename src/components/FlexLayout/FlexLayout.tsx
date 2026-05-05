import { lazy, Suspense, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { Box, Image, Tooltip } from "@mantine/core";
import {
  Model,
  Layout,
  Actions,
  TabNode,
  type ITabRenderValues,
  // DockLocation,
} from "flexlayout-react";
import "./flex-layout-main.css";
// import "flexlayout-react/style/light.css";
// import "flexlayout-react/style/dark.css";
// import "../../assets/css/dark.css";
// import "../../assets/css/light.css";

import {
  VCInfoIcon,
  VCSortIcon,
  VCFilterIcon,
  VCShareIcon,
  VCActivityIcon,
  VCDashboardsIcon,
  VCAIAssistantIcon,
  VCTraceabilityIcon,
  VCNewFileIcon,
  VCNewProjectIcon,
  VCNewReportIcon,
  VCNewWorkspaceIcon,
  VCFileIcon,
  VCProjectIcon,
  VCReportIcon,
  VCWorkspaceIcon,
  VCUserProfilesIcon,
  VCMyWorkspacesIcon,
  VCSettingsIcon,
  VCDeviceTvOldIcon,
  // VCFileZipIcon,
  VCJobsIcon,
  VCJobsInfoIcon,
  VCWorkflowIcon,
  VCSearchIcon,
  VCRoleIcon,
} from "../../assets/icons";

import "./styles.css";
import { layoutData } from "./layoutData";
import { useStore } from "../../store";
import { ProfileIcon } from "../../components/ProfileIcon";
import { parseQuery } from "../../utils/parseQuery";
import { AiAssistant } from "../AIAssistant/AiAssistant";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";
import Views from "../Views/Views";
import { ProfileAvatar } from "../ProfileAvatar/ProfileAvatar";
import { SearchItems } from "../SearchItems";
import { Permissions } from "../Permissions";
import type { UpdatedTabData } from "../../store/actionSlice";
const MediaViewer = lazy(() => import("../media-viewer/MediaViewer"));
const DashboardsList = lazy(() => import("../Dashboards/Dashboards"));
const ItemList = lazy(() => import("../ItemList/ItemList"));
const UserProfile = lazy(() => import("../UserProfile/UserProfile"));
const WorkspacesList = lazy(() => import("../WorkspacesList/WorkspacesList"));
const Traceability = lazy(() => import("../Traceability/Traceability"));
const NewFile = lazy(() => import("../NewFile/NewFile"));
const NewProject = lazy(() => import("../NewProject/NewProject"));
const NewReport = lazy(() => import("../NewReport/NewReport"));
const ItemInfo = lazy(() => import("../ItemInfo/ItemInfo"));
const Filters = lazy(() => import("../Filters/Filters"));
const SortBy = lazy(() => import("../SortBy/SortBy"));
const Users = lazy(() => import("../Users/Users"));
const ViewsActivity = lazy(() => import("../ViewsActivity/ViewsActivity"));
const NewModelType = lazy(() => import("../NewModelType/NewModelType"));
const NewWorkspace = lazy(() => import("../NewWorkspace/NewWorkspace"));
const ShareItemToWorkspace = lazy(
  () => import("../ShareItemToWorkspace/ShareItemToWorkspace"),
);
const UpdateUserProfileStatus = lazy(
  () => import("../UpdateUserProfileStatus/UpdateUserProfileStatus"),
);
const ItemActivity = lazy(() => import("../ItemActivity/ItemActivity"));
const Wcaxviewer = lazy(() => import("../Wcaxviewer/Wcaxviewer"));
const CraftViewer = lazy(() => import("../CraftViewer/CraftViewer"));
const EnterpriseViewer = lazy(
  () => import("../EnterpriseViewer/EnterpriseViewer"),
);
const CreateJob = lazy(() => import("../CreateJob/CreateJob"));
const JobInfo = lazy(() => import("../JobInfo/JobInfo"));
const CreateWorkflow = lazy(() => import("../CreateFlow/CreateFlow"));

interface TabComponentProps {
  content: any;
  tooltipText: string;
  icon: any;
  onClick?: () => void;
}

const TabComponent = ({
  content,
  tooltipText,
  icon: Icon,
  onClick,
}: TabComponentProps) => (
  <Box style={{ display: "flex", alignItems: "center" }} onClick={onClick}>
    <Tooltip label={tooltipText}>
      <Icon size={16} style={{ marginRight: "5px" }} />
    </Tooltip>
    {content}
  </Box>
);

const BorderTabComponent = ({ tooltipText, icon: Icon, onClick }: any) => (
  <Tooltip label={tooltipText}>
    <Box
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "rotate(90deg)",
      }}
      onClick={onClick}
    >
      <Icon size={20} stroke={1.5} />
    </Box>
  </Tooltip>
);

const getItemListTabIcon = (routePath: string) => {
  if (routePath.includes("/files")) {
    return { icon: VCFileIcon, label: "Files" };
  } else if (routePath.includes("/projects")) {
    return { icon: VCProjectIcon, label: "Projects" };
  } else if (routePath.includes("/reports")) {
    return { icon: VCReportIcon, label: "Reports" };
  } else if (routePath.includes("/workspaces")) {
    return { icon: VCWorkspaceIcon, label: "Workspaces" };
  } else if (routePath.includes("/users")) {
    return { icon: VCUserProfilesIcon, label: "Users" };
  } else if (routePath.includes("/roles")) {
    return { icon: VCRoleIcon, label: "Roles" };
  } else if (routePath.includes("/jobs")) {
    return { icon: VCJobsIcon, label: "Jobs" };
  } else if (routePath.includes("/workflows")) {
    return { icon: VCWorkflowIcon, label: "Workflows" };
  } else {
    return { icon: VCFileIcon, label: "Files" };
  }
};

const routeToTab: any = {
  "/files": "item_list",
  "/projects": "item_list",
  "/reports": "item_list",
  "/workspaces": "item_list",
  "/users": "item_list",
  "/roles": "item_list",
  "/jobs": "item_list",
  "/workflows": "item_list",
  "/my-profile": "profile_tab",
  "/my-workspaces": "workspaces_list",
  "/item-info": "item_info",
  "/item-traceability": "item_traceability",
  "/item-activity": "activity_tab",
  "/item-share": "item_share",
  "/view-filter": "filter_tab",
  "/view-sort": "sort_by_tab",
  "/view-activity": "view_item_activity_tab",
  "/workspace-users": "users_tab",
  "/user-status": "user_profile_status",
  "/new-file": "new_file",
  "/new-project": "new_project",
  "/new-report": "new_report",
  "/new-workspace": "new_workspace",
  "/wcxviewer": "wcaxviewer",
  "/epviewer": "enterpriseViewer",
  "/cftviewer": "craftViewer",
  "/mediaviewer": "mediaViewer",
  "/create-job": "createJob",
  "/job-info": "jobInfo",
  "/create-workflow": "createWorkflow",
  "/ai-assistant": "ai_assistant",
  "/permissions": "permissions",
};

const model = Model.fromJson(layoutData as any);

export const FlexLayout = () => {
  const tabIdToDelete = useStore((state) => state.tabIdToDelete);
  const userProfile = useStore((state) => state.userProfile);
  const updatedTabData = useStore((state) => state.updatedTabData);
  const setUpdatedTabData = useStore((state) => state.setUpdatedTabData);
  // const reloadComponent = useStore((state) => state.reloadComponent);
  // const setReloadComponent = useStore((state) => state.setReloadComponent);
  const layoutRef = useRef<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname, search } = location;

  // don't remove, older implementation for changing theme in flex layout
  // useEffect(() => {
  //   changeFlexLayoutTheme(colorScheme);
  // }, [colorScheme]);

  // const changeFlexLayoutTheme = (theme: string) => {
  //   const themeUrl =
  //     theme === "dark"
  //       ? "/flexlayout-themes/dark.css"
  //       : "/flexlayout-themes/light.css";

  //   let existingLink = document.getElementById(
  //     "flexlayout-theme"
  //   ) as HTMLLinkElement;

  //   if (existingLink) {
  //     existingLink.href = themeUrl; // Update existing theme
  //   } else {
  //     const link = document.createElement("link");
  //     link.id = "flexlayout-theme";
  //     link.rel = "stylesheet";
  //     link.href = themeUrl;
  //     // const link2 = document.createElement("link")
  //     // link2.rel = "stylesheet";
  //     // link2.href = "/flexlayout-themes/overrite.css"
  //     document.head.prepend(link);
  //     // document.head.appendChild(link);
  //     // document.head.appendChild(link2);
  //   }
  // };

  useEffect(() => {
    if (location) {
      if (search.includes("tabId") && search.includes("tabTitle")) {
        const parsedQuery = parseQuery(search);
        const { tabId, tabTitle, itemId } = parsedQuery;

        const href = window.location.href;
        const origin = window.location.origin;

        const fullRoutePath = href.slice(origin.length);

        const newTab = {
          componentType: routeToTab[pathname],
          tabId: tabId,
          tabTitle: tabTitle,
          params: {
            itemId,
            fullRoutePath,
          },
        };

        addNewTab(newTab);
      }
    }
  }, [location]);

  // useEffect(() => {
  //   if (newFlexLayoutTab.tabId) {
  //     addNewTab(newFlexLayoutTab);
  //   }
  // }, [newFlexLayoutTab]);

  useEffect(() => {
    if (tabIdToDelete) {
      deleteTab(tabIdToDelete);
    }
  }, [tabIdToDelete]);

  useEffect(() => {
    if (updatedTabData) {
      updateTab(updatedTabData);
    }
  }, [updatedTabData]);

  // useEffect(() => {
  //   if (reloadComponent) {
  //     reloadTabsByComponent(reloadComponent);
  //   }
  // }, [reloadComponent]);

  // const reloadTabsByComponent = (componentType: string) => {
  //   const nodesToUpdate: any[] = [];

  //   model.visitNodes((node: any) => {
  //     if (node.getType() === "tab" && node.getComponent() === componentType) {
  //       nodesToUpdate.push(node);
  //     }
  //   });

  //   nodesToUpdate.forEach((node) => {
  //     model.doAction(
  //       Actions.updateNodeAttributes(node.getId(), {
  //         config: { ...node.getConfig(), reloadTrigger: String(Date.now()) }, // Unique timestamp forces re-render
  //       })
  //     );
  //   });
  //   setReloadComponent("");
  // };

  const deleteTab = (tabId: string) => {
    model.doAction(Actions.deleteTab(tabId));
  };

  const deleteAllTabset = () => {
    const tabIdsToRemove: string[] = [];

    // Collect all layout tab IDs first
    model.visitNodes((node) => {
      if (
        node.getType() === "tab" &&
        node.getParent()?.getType() === "tabset" &&
        node.getId() !== "workspaces_list"
      ) {
        tabIdsToRemove.push(node.getId());
      }
    });

    // Remove collected tabs
    tabIdsToRemove.forEach((tabId) => {
      model.doAction(Actions.deleteTab(tabId));
    });
  };

  const factory = (node: any) => {
    var component = node.getComponent();
    const config = node.getConfig();

    const id = String(config?.id);
    // const reloadTrigger = config?.reloadTrigger;

    if (component === "item_list") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <ItemList viewId={id} />
        </Suspense>
      );
    } else if (component === "dashboards_list") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <DashboardsList />
        </Suspense>
      );
    } else if (component === "ai_assistant_border") {
      return <AiAssistant />;
    } else if (component === "profile_tab") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <UserProfile />
        </Suspense>
      );
    } else if (component === "workspaces_list") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <WorkspacesList deleteAllTabset={deleteAllTabset} />
        </Suspense>
      );
    } else if (component === "item_traceability") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Traceability itemId={id} />
        </Suspense>
      );
    } else if (component === "new_file") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <NewFile />
        </Suspense>
      );
    } else if (component === "new_project") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <NewProject />
        </Suspense>
      );
    } else if (component === "new_report") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <NewReport />
        </Suspense>
      );
    } else if (component === "item_info") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <ItemInfo itemId={id} />
        </Suspense>
      );
    } else if (component === "filter_tab") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Filters viewId={id} />
        </Suspense>
      );
    } else if (component === "sort_by_tab") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <SortBy viewId={id} />
        </Suspense>
      );
    } else if (component === "users_tab") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Users itemId={id} />
        </Suspense>
      );
    } else if (component === "activity_tab") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <ItemActivity itemId={id} />
        </Suspense>
      );
    } else if (component === "view_item_activity_tab") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <ViewsActivity viewId={id} />
        </Suspense>
      );
    } else if (component === "new_model_type") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <NewModelType />
        </Suspense>
      );
    } else if (component === "new_workspace") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <NewWorkspace />
        </Suspense>
      );
    } else if (component === "item_share") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <ShareItemToWorkspace itemId={id} />
        </Suspense>
      );
    } else if (component === "user_profile_status") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <UpdateUserProfileStatus itemId={id} />
        </Suspense>
      );
    } else if (component === "wcaxviewer") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Wcaxviewer itemId={id} />
        </Suspense>
      );
    } else if (component === "enterpriseViewer") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <EnterpriseViewer />
        </Suspense>
      );
    } else if (component === "craftViewer") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <CraftViewer itemId={id} />
        </Suspense>
      );
    } else if (component === "mediaViewer") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <MediaViewer itemId={id} />
        </Suspense>
      );
    } else if (component === "createJob") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <CreateJob itemId={id} />
        </Suspense>
      );
    } else if (component === "jobInfo") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <JobInfo itemId={id} />
        </Suspense>
      );
    } else if (component === "createWorkflow") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <CreateWorkflow itemId={id} />
        </Suspense>
      );
    } else if (component === "permissions") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Permissions itemId={id} />
        </Suspense>
      );
    } else if (component === "files") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Views itemType="file" />
        </Suspense>
      );
    } else if (component === "projects") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Views itemType="project" />
        </Suspense>
      );
    } else if (component === "reports") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Views itemType="report" />
        </Suspense>
      );
    } else if (component === "workspaces") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Views itemType="workspace" />
        </Suspense>
      );
    } else if (component === "users") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Views itemType="user_profile" />
        </Suspense>
      );
    } else if (component === "roles") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Views itemType="role" />
        </Suspense>
      );
    } else if (component === "workflows") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Views itemType="workflow" />
        </Suspense>
      );
    } else if (component === "jobs") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Views itemType="job" />
        </Suspense>
      );
    } else if (component === "ai_assistant") {
      return <AiAssistant projectId={id} />;
    } else if (component === "search_border") {
      return (
        <Suspense fallback={<LoadingComponent />}>
          <Box p="sm">
            <SearchItems />
          </Box>
        </Suspense>
      );
    }
  };

  const onRenderTab = (node: TabNode, renderValues: ITabRenderValues) => {
    const config = node.getConfig();
    const component = node.getComponent();
    const fullRoutePath = config?.fullRoutePath;

    const onClick = () => {
      navigate(fullRoutePath);
    };

    if (component === "item_list") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText={getItemListTabIcon(fullRoutePath)?.label}
          icon={getItemListTabIcon(fullRoutePath)?.icon}
          onClick={onClick}
        />
      );
    }
    if (component === "filter_tab") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Filters"
          icon={VCFilterIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "sort_by_tab") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Sort"
          icon={VCSortIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "view_item_activity_tab") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="View Activity"
          icon={VCActivityIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "item_traceability") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Traceability"
          icon={VCTraceabilityIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "activity_tab") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Item Activity"
          icon={VCActivityIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "item_share") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Share"
          icon={VCShareIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "item_info") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Info"
          icon={VCInfoIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "user_profile_status") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Status"
          icon={VCSettingsIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "files") {
      renderValues.content = (
        <BorderTabComponent tooltipText="Files" icon={VCFileIcon} />
      );
    }
    if (component === "search_border") {
      renderValues.content = (
        <BorderTabComponent tooltipText="Search" icon={VCSearchIcon} />
      );
    }
    if (component === "projects") {
      renderValues.content = (
        <BorderTabComponent tooltipText="Projects" icon={VCProjectIcon} />
      );
    }
    if (component === "reports") {
      renderValues.content = (
        <BorderTabComponent tooltipText="Reports" icon={VCReportIcon} />
      );
    }
    if (component === "workspaces") {
      renderValues.content = (
        <BorderTabComponent tooltipText="Workspaces" icon={VCWorkspaceIcon} />
      );
    }
    if (component === "users") {
      renderValues.content = (
        <BorderTabComponent tooltipText="Users" icon={VCUserProfilesIcon} />
      );
    }
    if (component === "roles") {
      renderValues.content = (
        <BorderTabComponent tooltipText="Roles" icon={VCRoleIcon} />
      );
    }
    if (component === "workflows") {
      renderValues.content = (
        <BorderTabComponent tooltipText="Workflows" icon={VCWorkflowIcon} />
      );
    }
    if (component === "jobs") {
      renderValues.content = (
        <BorderTabComponent tooltipText="Jobs" icon={VCJobsIcon} />
      );
    }
    if (component === "ai_assistant_border") {
      renderValues.content = (
        <BorderTabComponent
          tooltipText="AI Assistant"
          icon={VCAIAssistantIcon}
        />
      );
    }
    if (component === "dashboards_list") {
      renderValues.content = (
        <BorderTabComponent tooltipText="Dashboards" icon={VCDashboardsIcon} />
      );
    }
    if (component === "main_logo") {
      const nodeId = node.getId();
      const onClick = () => {
        // Close the border panel (selectTab toggles — if now open, this closes it)
        model.doAction(Actions.selectTab(nodeId));
        // Open the my workspaces main tab
        // navigate("/my-workspaces?tabId=workspaces_list&tabTitle=Workspaces");
      };

      renderValues.content = (
        <Box
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(90deg)",
          }}
          onClick={onClick}
        >
          <Image style={{ width: "35%" }} src={"/favicon.ico"} alt="app_logo" />
          {/* <ProfileAvatar
            picture={"/favicon.ico"}
            onClick={onClick}
          /> */}
        </Box>
      );
    }
    if (component === "my_workspaces_border") {
      const nodeId = node.getId();
      const onMyWorkspacesClick = () => {
        // Close the border panel (selectTab toggles — if now open, this closes it)
        model.doAction(Actions.selectTab(nodeId));
        // Open the my workspaces main tab
        navigate("/my-workspaces?tabId=workspaces_list&tabTitle=Workspaces");
      };

      renderValues.content = (
        <BorderTabComponent
          tooltipText="My Workspaces"
          icon={VCWorkspaceIcon}
          onClick={onMyWorkspacesClick}
        />
      );
    }
    if (component === "profile_border") {
      const nodeId = node.getId();
      const onProfileClick = () => {
        // Close the border panel (selectTab toggles — if now open, this closes it)
        model.doAction(Actions.selectTab(nodeId));
        // Open the profile main tab
        navigate("/my-profile?tabId=profile_tab&tabTitle=Profile");
        // addNewTab({
        //   componentType: "profile_tab",
        //   tabId: "my-profile",
        //   tabTitle: "My Profile",
        //   params: { itemId: undefined, fullRoutePath: "/my-profile" },
        // });
      };

      renderValues.content = (
        <Tooltip label={"User Profile"}>
          <Box
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(90deg)",
            }}
          >
            <ProfileAvatar
              picture={userProfile?.picture}
              onClick={onProfileClick}
              // onClick={() => {}}
            />
          </Box>
        </Tooltip>
      );
    }
    // if (component === "ai_assistant") {
    //   renderValues.content = (
    //     <TabComponent
    //       content={renderValues.content}
    //       tooltipText="AI Assistant"
    //       icon={VCAIAssistantIcon}
    //       // onClick={onClick}
    //     />
    //   );
    // }
    // if (component === "dashboards_list") {
    //   renderValues.content = (
    //     <TabComponent
    //       content={renderValues.content}
    //       tooltipText="Dashboards"
    //       icon={VCDashboardsIcon}
    //       // onClick={onClick}
    //     />
    //   );
    // }
    if (component === "ai_assistant") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="AI Assistant"
          icon={VCAIAssistantIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "new_file") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="New File"
          icon={VCNewFileIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "new_project") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="New Project"
          icon={VCNewProjectIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "new_report") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="New Report"
          icon={VCNewReportIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "new_workspace") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="New Workspace"
          icon={VCNewWorkspaceIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "profile_tab") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Profile"
          icon={ProfileIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "workspaces_list") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Workspaces"
          icon={VCWorkspaceIcon}
          // icon={VCMyWorkspacesIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "wcaxviewer") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="WcaxViewer"
          icon={VCMyWorkspacesIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "craftViewer") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Report Viewer"
          icon={VCMyWorkspacesIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "enterpriseViewer") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Enterprise Viewer"
          icon={VCMyWorkspacesIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "mediaViewer") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Media Viewer"
          icon={VCDeviceTvOldIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "createJob") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Create Job"
          icon={VCJobsIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "jobInfo") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Job Info"
          icon={VCJobsInfoIcon}
          onClick={onClick}
        />
      );
    }
    if (component === "createWorkflow") {
      renderValues.content = (
        <TabComponent
          content={renderValues.content}
          tooltipText="Create Workflow"
          icon={VCWorkflowIcon}
          onClick={onClick}
        />
      );
    }
  };

  // const onModelChange = () => {
  //   // After any model change (e.g. tab close), sync the route to the active tab
  //   let activeTabPath: string | null = null;

  //   model.visitNodes((node: any) => {
  //     if (node.getType() === "tabset" && node.isActive()) {
  //       const selectedNode = node.getSelectedNode();
  //       if (selectedNode) {
  //         const config = selectedNode.getConfig();
  //         if (config?.fullRoutePath) {
  //           activeTabPath = config.fullRoutePath;
  //         }
  //       }
  //     }
  //   });

  //   if (activeTabPath) {
  //     navigate(activeTabPath);
  //   }
  // };

  const onAuxMouseClick = (props: any) => {
    console.log({ props });
  };

  const addNewTab = (newFlexLayoutTab: {
    componentType: string;
    tabId: string;
    tabTitle: string;
    params: any;
  }) => {
    const { componentType, tabId, tabTitle, params } = newFlexLayoutTab;

    let existingTab: any = null;

    // Find if tab already exists
    model.visitNodes((node: any) => {
      if (node.getType() === "tab" && node.getId() === tabId) {
        existingTab = node;
      }
    });

    if (existingTab) {
      // If tab exists, activate it
      // const parent = existingTab.getParent();
      model.doAction(Actions.selectTab(existingTab.getId()));
    } else {
      const newTab = {
        type: "tab",
        id: tabId,
        component: componentType,
        name: tabTitle,
        config: {
          id: params?.itemId,
          fullRoutePath: params?.fullRoutePath,
        },
      };

      // model.doAction(Actions.addNode(newTab, tabId, DockLocation.TOP, 0, true));
      layoutRef.current.addTabToActiveTabSet(newTab);
    }
  };

  const updateTab = (tabData: UpdatedTabData) => {
    let existingTab: any = null;

    // Find if tab already exists
    model.visitNodes((node: any) => {
      if (node.getType() === "tab" && node.getId() === tabData?.id) {
        existingTab = node;
      }
    });

    if (existingTab) {
      // const config = existingTab.getConfig();
      // const fullRoutePath = config?.fullRoutePath;
      console.log({ path: existingTab.getConfig().fullRoutePath });

      const url = new URL(
        existingTab.getConfig().fullRoutePath,
        window.location.origin,
      );
      url.searchParams.set("tabTitle", tabData.name);
      const newFullRoutePath = url.pathname + "?" + url.searchParams.toString();

      // const url = new URL(existingTab.getConfig().fullRoutePath);
      // url.searchParams.set("tabTitle", tabData.name);
      // const newFullRoutePath = url.toString();

      model.doAction(
        Actions.updateNodeAttributes(existingTab.getId(), {
          name: tabData?.name,
          config: {
            id: existingTab.getConfig().id,
            fullRoutePath: newFullRoutePath,
          },
        }),
      );
    }
    setUpdatedTabData(null);
  };

  return (
    <Layout
      ref={layoutRef}
      model={model}
      factory={factory}
      onRenderTab={onRenderTab}
      onAuxMouseClick={onAuxMouseClick}
      // onModelChange={onModelChange}
    />
  );
};
