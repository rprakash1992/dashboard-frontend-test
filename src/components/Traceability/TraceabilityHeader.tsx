import { useEffect, useState } from "react";
import { Box, Tabs } from "@mantine/core";
import { VCFileIcon, VCProjectIcon, VCReportIcon } from "../../assets/icons";

type TraceabilityTabItem = {
  tabId: string;
  tabTitle: string;
  TabIcon?: any;
};

const traceabilityTabs: Record<string, TraceabilityTabItem[]> = {
  file: [
    {
      tabId: "project",
      tabTitle: "Projects",
      TabIcon: VCProjectIcon,
    },
  ],
  project: [
    {
      tabId: "file",
      tabTitle: "Files",
      TabIcon: VCFileIcon,
    },
    {
      tabId: "report",
      tabTitle: "Reports",
      TabIcon: VCReportIcon,
    },
  ],
  report: [
    {
      tabId: "project",
      tabTitle: "Projects",
      TabIcon: VCProjectIcon,
    },
  ],
  job: [
    {
      tabId: "input_items",
      tabTitle: "Input Items",
    },
    {
      tabId: "output_items",
      tabTitle: "Output Items",
    },
  ],
  workflow: [
    {
      tabId: "input_items",
      tabTitle: "Input Items",
    },
    {
      tabId: "output_items",
      tabTitle: "Output Items",
    },
  ],
};

export const TraceabilityHeader = ({
  setSelectedTabType,
  selectedItemType,
}: any) => {
  const traceabilityTabsItems = traceabilityTabs[selectedItemType];
  const [activeTab, setActiveTab] = useState<string | null>(
    traceabilityTabsItems[0]?.tabId,
  );

  useEffect(() => {
    setSelectedTabType(activeTab);
  }, [activeTab]);

  return (
    <Box
      style={{
        width: "100%",
        height: "40px",
        padding: "0 10px",
      }}
    >
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          {traceabilityTabsItems.map(({ tabId, tabTitle, TabIcon }) => (
            <Tabs.Tab
              style={{ flex: 1 }}
              value={tabId}
              leftSection={TabIcon ? <TabIcon size={12} /> : null}
            >
              {tabTitle}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
    </Box>
  );
};
