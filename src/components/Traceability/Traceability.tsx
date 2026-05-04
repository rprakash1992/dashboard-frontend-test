import { useEffect, useState } from "react";
import { Box } from "@mantine/core";
import "./styles.css";
import { useStore } from "../../store";
import { RelatedItems } from "./RelatedItems";
import { TraceabilityHeader } from "./TraceabilityHeader";
import { itemApi } from "../../apiActions/itemApi";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";
import { ErrorComponent } from "../ErrorComponent/ErrorComponent";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { AlertMsgType } from "../../store/actionSlice";

interface TraceabilityProps {
  itemId: string;
}

const Traceability = ({ itemId }: TraceabilityProps) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [fetchingData, setFetchingData] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [selectedTabType, setSelectedTabType] = useState("project");
  const [data, setData] = useState<any>([]);
  const [selectedItemType, setSelectedItemType] = useState<string>("");
  const [traceabilityData, setTraceabilityData] = useState<any>({});

  useEffect(() => {
    if (itemId) {
      fetchTraceabilityData(itemId);
    }
  }, [itemId]);

  useEffect(() => {
    if (selectedItemType === "file") {
      setData(traceabilityData?.projects);
    }
    if (selectedItemType === "project" && selectedTabType === "file") {
      setData(traceabilityData?.files);
    }
    if (selectedItemType === "project" && selectedTabType === "report") {
      setData(traceabilityData?.reports);
    }
    if (selectedItemType === "report") {
      setData(traceabilityData?.projects);
    }
    if (selectedItemType === "job" && selectedTabType === "input_items") {
      setData(traceabilityData?.inputs);
    }
    if (selectedItemType === "job" && selectedTabType === "output_items") {
      setData(traceabilityData?.outputs);
    }
    if (selectedItemType === "workflow" && selectedTabType === "input_items") {
      setData(traceabilityData?.inputs);
    }
    if (selectedItemType === "workflow" && selectedTabType === "output_items") {
      setData(traceabilityData?.outputs);
    }
  }, [selectedTabType, selectedItemType, traceabilityData]);

  const fetchTraceabilityData = async (itemId: string) => {
    try {
      setFetchingData(true);
      const { data, error } = await itemApi.getItemTraceability(itemId);

      if (error) {
        console.error(error);
        setErrorState(true);
        setDialogBoxMsg(String(error), AlertMsgType.ERROR);
      }

      if (data) {
        const { item_type, traceability_data } = data;
        setSelectedItemType(item_type);
        setTraceabilityData(traceability_data);
      }
    } catch (error) {
      console.error(error);
      setErrorState(true);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setFetchingData(false);
    }
  };

  const addNewReport = () => {};

  if (fetchingData) {
    return (
      <MaxWidthContainer>
        <LoadingComponent />
      </MaxWidthContainer>
    );
  }

  if (errorState) {
    return (
      <MaxWidthContainer>
        <ErrorComponent />
      </MaxWidthContainer>
    );
  }

  return (
    <MaxWidthContainer>
      <Box>
        <TraceabilityHeader
          setSelectedTabType={setSelectedTabType}
          selectedItemType={selectedItemType}
        />
        <RelatedItems
          data={data}
          disabledBtn={selectedTabType === "file"}
          addNewReport={addNewReport}
          selectedItemType={selectedItemType}
        />
      </Box>
    </MaxWidthContainer>
  );
};

export default Traceability;
