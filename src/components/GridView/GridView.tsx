import { useEffect, useRef, useState } from "react";
import { Accordion, Box, Grid } from "@mantine/core";
import { useStore } from "../../store";
import { GridItemCard } from "../gridItemCard/GridItemCard";
import { SkeletonGridCard } from "../gridItemCard/SkeletonGridCard";
import type {
  File,
  Job,
  ItemMetadataType,
  ItemsToDisplayType,
} from "../../types";

interface GridViewType {
  fileItems: File[];
  jobItems: Job[];
  runItems: Job[];
  itemsToDisplay: ItemsToDisplayType[];
  loadingExtractionsCompressions: string[];
  loadingDashboardItems: boolean;
  removeRunItem: (itemId: string) => void;
  handleDeleteItem: (item: ItemMetadataType) => void;
  handleOpenItem: (item: ItemMetadataType) => void;
  handleDownloadFile: (item: ItemMetadataType) => void;
  selectItemProperty: (
    item: ItemMetadataType,
    id: string,
    route: string,
    showCommentBox: boolean,
  ) => void;
  handleCommentClick: (item: ItemMetadataType) => void;
  handleCopyItem: (item: ItemMetadataType) => void;
  handleExtract: (itemId: string) => void;
  handleZipFile: (itemId: string) => void;
  runFlow: (itemId: string) => void;
  createFlow: (itemId: string) => void;
}

const getSpan = (containerWidth: number) => {
  if (containerWidth > 1200) {
    return 3;
  } else if (containerWidth > 950 && containerWidth < 1200) {
    return 4;
  } else if (containerWidth > 550 && containerWidth < 950) {
    return 6;
  } else {
    return 12;
  }
};

export const GridView = ({
  fileItems,
  jobItems,
  runItems,
  itemsToDisplay,
  loadingExtractionsCompressions,
  loadingDashboardItems,
  removeRunItem,
  handleDeleteItem,
  selectItemProperty,
  handleOpenItem,
  handleDownloadFile,
  handleCommentClick,
  handleCopyItem,
  handleExtract,
  handleZipFile,
  runFlow,
  createFlow,
}: GridViewType) => {
  const [span, setSpan] = useState<number>(3);
  const [tabValue, setTabValue] = useState<string[]>([]);
  const fileUploads = useStore((state) => state.fileUploads);
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingIdsRef = useRef<string[]>([]);

  const openAccordions = (ids: string[]) => {
    // When the tab is hidden (display:none by flexlayout), Mantine measures
    // panel heights as 0. Defer opening until the container is actually visible.
    const el = containerRef.current;
    if (el && el.offsetParent !== null) {
      setTabValue(ids);
    } else {
      pendingIdsRef.current = ids;
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setSpan(getSpan(entry.contentRect.width));
      // Tab just became visible (width went from 0 to >0) — apply any pending open state.
      if (entry.contentRect.width > 0 && pendingIdsRef.current.length > 0) {
        setTabValue(pendingIdsRef.current);
        pendingIdsRef.current = [];
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ids = itemsToDisplay.map((i) => String(i.id));
    openAccordions(ids);
  }, [itemsToDisplay]);

  if (loadingDashboardItems) {
    return (
      <Box ref={containerRef} p="xs">
        <Grid>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Grid.Col span={span} key={i}>
              <SkeletonGridCard />
            </Grid.Col>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box ref={containerRef}>
      <Accordion
        multiple
        chevronPosition="left"
        value={tabValue}
        onChange={setTabValue}
      >
        {itemsToDisplay?.map((itemToDisplay: ItemsToDisplayType) => (
          <Accordion.Item
            style={{ borderBottom: "none" }}
            key={itemToDisplay.id}
            value={String(itemToDisplay.id)}
          >
            <Accordion.Control>{itemToDisplay.title}</Accordion.Control>
            <Accordion.Panel>
              <Grid>
                {itemToDisplay?.children.map((item: ItemMetadataType) => {
                  if (item?.item_type === "dummy") {
                    return (
                      <Grid.Col span={span} key={item?.id}>
                        <SkeletonGridCard />
                      </Grid.Col>
                    );
                  }
                  const jobItem =
                    jobItems.find((job) => job?.id === item.id) || null;
                  const fileItem = fileItems.find(
                    (file) => file?.id === item.id,
                  );
                  const fileExtension = fileItem?.mime_type || null;
                  const isFolderItem = fileItems.find(
                    (file) => file?.parent === item?.id,
                  );

                  let isZip = false;
                  let isFlow = false;

                  if (item?.item_type === "file") {
                    isFlow = fileExtension === "workflow.zip";
                    isZip = fileExtension === "zip";
                  }

                  const fileUploadDetails = fileUploads[item?.id];
                  const runDetails = runItems.find(
                    (r) => r.output_item_id === item?.id,
                  );
                  const isLoadingExtractionCompression =
                    loadingExtractionsCompressions.includes(item?.id);

                  return (
                    <Grid.Col span={span} key={item.id}>
                      <GridItemCard
                        fileExtension={fileExtension}
                        fileUploadDetails={fileUploadDetails}
                        item={item}
                        isFolderItem={!!isFolderItem}
                        isZip={isZip}
                        isFlow={isFlow}
                        runDetails={runDetails}
                        isLoadingExtractionCompression={
                          isLoadingExtractionCompression
                        }
                        jobDetails={jobItem}
                        onComplete={removeRunItem}
                        handleDeleteItem={() => handleDeleteItem(item)}
                        handleOpenItem={() => handleOpenItem(item)}
                        handleDownloadFile={() => handleDownloadFile(item)}
                        handleCopyItem={() => handleCopyItem(item)}
                        handleCommentClick={() => handleCommentClick(item)}
                        handlePropertyBtnClick={(prop: string, route: string) =>
                          selectItemProperty(item, prop, route, false)
                        }
                        handleExtract={() => handleExtract(item?.id)}
                        handleZipFile={() => handleZipFile(item?.id)}
                        runFlow={() => runFlow(item?.id)}
                        createFlow={() => createFlow(item?.id)}
                        // disabledComment={
                        //   item?.item_type === "workspace" ||
                        //   item?.item_type === "user"
                        // }
                      />
                    </Grid.Col>
                  );
                })}
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  );
};
