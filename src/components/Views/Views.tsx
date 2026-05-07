import { useState } from "react";
import { Box, List } from "@mantine/core";
import { useLocation, useNavigate } from "react-router";
import { useStore } from "../../store";
import { useViewActions } from "../../customHooks/useViewActions";
import { OneViewItem } from "./OneViewItem";
import { parseQuery } from "../../utils/parseQuery";
import { ViewHeader } from "./ViewHeader";
import { NewViewInputBox } from "./NewViewInputBox";
import { ViewsAddingInProgress } from "./ViewsAddingInProgress";

type NavItem = {
  id: string;
  label: string;
  route: string;
  itemType: string;
};

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
    title: "New Role",
  },
};

const leftSideNavItems: { [key: string]: NavItem } = {
  file: {
    id: "file",
    label: "Files",
    route: "/files",
    // icon: VCFileIcon,
    itemType: "file",
  },
  project: {
    id: "project",
    label: "Projects",
    route: "/projects",
    // icon: VCProjectIcon,
    itemType: "project",
  },
  report: {
    id: "report",
    label: "Reports",
    route: "/reports",
    // icon: VCReportIcon,
    itemType: "report",
  },
  workspace: {
    id: "workspace",
    label: "Workspaces",
    route: "/workspaces",
    // icon: VCWorkspaceIcon,
    itemType: "workspace",
  },
  user_profile: {
    id: "user_profile",
    label: "Users",
    route: "/users",
    // icon: VCUserProfilesIcon,
    itemType: "user_profile",
  },
  workflow: {
    id: "workflow",
    label: "Workflows",
    route: "/workflows",
    // icon: VCWorkflowIcon,
    itemType: "workflow",
  },
  job: {
    id: "job",
    label: "Jobs",
    route: "/jobs",
    // icon: VCJobsIcon,
    itemType: "job",
  },
  role: {
    id: "roles",
    label: "Roles",
    route: "/roles",
    itemType: "role",
  },
};

const Views = ({ itemType }: { itemType: string }) => {
  const views = useStore((state) => state.viewProperties);
  const viewsAddingInProgress = useStore(
    (state) => state.viewsAddingInProgress,
  );
  const { togglePinView, renameView, addNewView } = useViewActions();
  const [showNewViewInputBox, setShowNewViewInputBox] =
    useState<boolean>(false);
  const [newViewTitle, setNewViewTitle] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const { search } = location;
  const parsedQuery = parseQuery(search);
  const { tabId, itemId } = parsedQuery;

  const filteredViews = views
    .filter((view) => view.item_type === itemType)
    .sort((viewA, viewB) => Number(viewA.id) - Number(viewB.id));
  const navItem = leftSideNavItems[itemType];

  const onViewClick = (viewId: string, viewTitle: string) => {
    const route = navItem.route;
    // const viewTitle = navItem.label;

    navigate(`${route}?tabId=${viewId}&tabTitle=${viewTitle}&itemId=${viewId}`);
  };

  const openInputBox = (e: any) => {
    e.stopPropagation();
    setShowNewViewInputBox(true);
  };

  const onNewIconClick = (itemId: any, itemTitle: any) => {
    const getRoute: any = {
      new_file: "/new-file",
      new_project: "/new-project",
      new_report: "/new-report",
      new_workspace: "/new-workspace",
      new_role: "/new-role",
    };
    const route = getRoute[itemId];
    navigate(`${route}?tabId=${itemId}&tabTitle=${itemTitle}`);
  };

  const onNewItemBtnClick = (e: any) => {
    e.stopPropagation();
    onNewIconClick(newItemDetails[itemType].id, newItemDetails[itemType].title);
  };

  const submitNewView = (e: any) => {
    if (e.key === "Escape") {
      setShowNewViewInputBox(false);
      setNewViewTitle("");
    }
    if (e.key === "Enter") {
      addNewView(newViewTitle, itemType);
      setNewViewTitle("");
      setShowNewViewInputBox(false);
    }
  };

  return (
    <Box>
      <Box p="12px">
        <ViewHeader
          title={navItem.label}
          itemType={itemType}
          newIconTitle={newItemDetails[itemType]?.title}
          openInputBox={openInputBox}
          onNewItemBtnClick={onNewItemBtnClick}
        />
      </Box>
      <List listStyleType="none">
        {filteredViews.map((view) => (
          <OneViewItem
            key={view.id}
            title={view.title}
            active={
              String(view.id) === String(tabId) &&
              String(itemId) === String(tabId)
            }
            pinned={view.status === "pinned"}
            selectView={() => onViewClick(view.id, view.title)}
            togglePinView={() => togglePinView(view.id)}
            renameView={(newTitle: string) => renameView(view.id, newTitle)}
          />
        ))}
        {showNewViewInputBox && (
          <NewViewInputBox
            newViewTitle={newViewTitle}
            setNewViewTitle={setNewViewTitle}
            setShowNewViewInputBox={setShowNewViewInputBox}
            submitNewView={submitNewView}
          />
        )}
        {viewsAddingInProgress.map((view) => (
          <ViewsAddingInProgress title={view.title} />
        ))}
      </List>
    </Box>
  );
};

export default Views;
