import { useLocation } from "react-router";
import { Box, Breadcrumbs, ScrollArea, Text } from "@mantine/core";
import styles from "./styles.module.css";
import { ViewActionBtns } from "./ViewActionsBtns";
import { RouteItemsEnums } from "../../data/gui/RouteEnums";
import type { ViewItemPropertyType } from "../../store/viewSlice";
import { VCChevronRightIcon } from "../../assets/icons";

interface ActionPanelProps {
  activeView: ViewItemPropertyType;
  viewsBreadcrum: ViewItemPropertyType[];
  setActiveView: (view: ViewItemPropertyType) => void;
  setViewsBreadcrum: (views: ViewItemPropertyType[]) => void;
}

export const ViewActionsPanel = ({
  activeView,
  viewsBreadcrum,
  setActiveView,
  setViewsBreadcrum,
}: ActionPanelProps) => {
  const { pathname } = useLocation();

  const onBreadcrumClick = (currentBreadCrum: ViewItemPropertyType) => {
    const currentBreadcrumIndex = viewsBreadcrum.findIndex(
      (view) => view.id === currentBreadCrum.id,
    );

    setViewsBreadcrum(viewsBreadcrum.slice(0, currentBreadcrumIndex + 1));
    setActiveView(currentBreadCrum);
  };

  return (
    <Box className={styles.actionPanelContainer}>
      <Box className={styles.breadcrumsContainer}>
        <ScrollArea type="never">
          <Breadcrumbs
            separatorMargin={0}
            separator={<VCChevronRightIcon />}
            style={{ cursor: "pointer" }}
          >
            <Text>{RouteItemsEnums[pathname] ?? "Files"}</Text>
            {viewsBreadcrum?.length > 0 ? (
              viewsBreadcrum?.map((item: ViewItemPropertyType) => (
                <Text
                  key={item?.id}
                  style={{ cursor: "pointer", textWrap: "nowrap" }}
                  onClick={() => onBreadcrumClick(item)}
                >
                  {item?.title}
                </Text>
              ))
            ) : (
              <Text>{activeView?.title}</Text>
            )}
          </Breadcrumbs>
        </ScrollArea>
      </Box>
      <ViewActionBtns activeView={activeView as ViewItemPropertyType} />
    </Box>
  );
};
