import { useState } from "react";
import { useLocation } from "react-router";
import { Accordion, List } from "@mantine/core";
import type { ViewItemPropertyType } from "../../store/viewSlice";
import { useViewActions } from "../../customHooks/useViewActions";
import { parseQuery } from "../../utils/parseQuery";
import { newItemDetails } from "./Dashboards";
import { AccordionControl } from "./AccordionControl";
import { OneViewItem } from "./OneViewItem";
import { NewViewInputBox } from "./NewViewInputBox";

interface OneDashboardItemProps {
  dashboardItemId: string;
  title: string;
  icon: any;
  childItems: ViewItemPropertyType[];
  onNewIconClick: () => void;
  onViewClick: (item: ViewItemPropertyType) => void;
  setAccordionItemId: (val: string) => void;
}

export const OneDashboardItem = ({
  dashboardItemId,
  title,
  icon,
  childItems,
  onNewIconClick,
  onViewClick,
  setAccordionItemId,
}: OneDashboardItemProps) => {
  const { addNewView, togglePinView, renameView } = useViewActions();
  const [showNewViewInputBox, setShowNewViewInputBox] =
    useState<boolean>(false);
  const [newViewTitle, setNewViewTitle] = useState<string>("");
  const location = useLocation();
  const { search } = location;
  const parsedQuery = parseQuery(search);
  const { tabId, itemId } = parsedQuery;

  const openInputBox = (e: any) => {
    e.stopPropagation();
    setShowNewViewInputBox(true);
    setAccordionItemId(dashboardItemId);
  };

  const onNewItemBtnClick = (e: any) => {
    e.stopPropagation();
    onNewIconClick();
  };

  const submitNewView = (e: any) => {
    if (e.key === "Escape") {
      setShowNewViewInputBox(false);
    }
    if (e.key === "Enter") {
      addNewView(newViewTitle, dashboardItemId);
      setNewViewTitle("");
      setShowNewViewInputBox(false);
    }
  };

  return (
    <Accordion.Item value={dashboardItemId}>
      <AccordionControl
        title={title}
        icon={icon}
        newIconTitle={newItemDetails[dashboardItemId]?.title}
        dashboardItemId={dashboardItemId}
        openInputBox={openInputBox}
        onNewItemBtnClick={onNewItemBtnClick}
      />
      <Accordion.Panel>
        <List listStyleType="none">
          {childItems.length > 0 &&
            childItems.map((view) => (
              <OneViewItem
                key={view.id}
                title={view.title}
                active={
                  String(view.id) === String(tabId) &&
                  String(itemId) === String(tabId)
                }
                pinned={view.status === "pinned"}
                selectView={() => onViewClick(view)}
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
        </List>
      </Accordion.Panel>
    </Accordion.Item>
  );
};
