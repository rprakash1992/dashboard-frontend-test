import { useNavigate } from "react-router";
import { Group } from "@mantine/core";
import { useViewActions } from "../../customHooks/useViewActions";
import { IconRenderer } from "../IconRenderer/IconRenderer";
import { ViewAsControl } from "./ViewAsControl";
import type { ViewItemPropertyType } from "../../store/viewSlice";
import {
  VCCopyIcon,
  VCTrashIcon,
  // VCActivityIcon,
  VCSortIcon,
  VCFilterIcon,
} from "../../assets/icons";
import { useStore } from "../../store";

export const ViewPropertiesItems = [
  {
    id: "filter_tab",
    route: "/view-filter",
    name: "Filter",
    icon: VCFilterIcon,
  },
  {
    id: "sort_by_tab",
    route: "/view-sort",
    name: "SortBy",
    icon: VCSortIcon,
  },
  // {
  //   id: "view_item_activity_tab",
  //   route: "/view-activity",
  //   name: "View Activity",
  //   icon: VCActivityIcon,
  // },
];

interface ViewActionBtnsProps {
  activeView: ViewItemPropertyType;
}

export const ViewActionBtns = ({ activeView }: ViewActionBtnsProps) => {
  const { deleteView, copyView } = useViewActions();
  const isCopyingView = useStore((state) => state.isCopyingView);
  const isDeletingView = useStore((state) => state.isDeletingView);
  const navigate = useNavigate();
  const isDisabled = !activeView || activeView?.status === "permanent";

  const selectViewProperty = (id: string, route: string) => {
    if (!!activeView) {
      navigate(
        `${route}?tabId=${activeView.id}${id}&tabTitle=${activeView.title}&itemId=${activeView.id}`,
      );
    }
  };

  return (
    <Group gap="5px" pr={10}>
      <ViewAsControl activeView={activeView} isDisabled={isDisabled} />
      {ViewPropertiesItems.map((ele) => (
        <IconRenderer
          key={ele.id}
          icon={ele.icon}
          tooltipLabel={ele.name}
          isdisabled={isDisabled}
          tooltipPosition="bottom"
          onClick={() => selectViewProperty(ele.id, ele.route)}
        />
      ))}
      <IconRenderer
        icon={VCCopyIcon}
        tooltipLabel="Copy"
        isdisabled={isDisabled || isCopyingView}
        isLoading={isCopyingView}
        tooltipPosition="bottom"
        onClick={() => copyView(activeView)}
      />
      <IconRenderer
        icon={VCTrashIcon}
        tooltipLabel="Delete"
        isdisabled={isDisabled || isDeletingView}
        isLoading={isDeletingView}
        tooltipPosition="bottom"
        onClick={() => deleteView(activeView.id)}
      />
    </Group>
  );
};
