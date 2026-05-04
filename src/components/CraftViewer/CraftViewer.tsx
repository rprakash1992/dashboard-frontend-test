import { useEffect, useState } from "react";
import { Box } from "@mantine/core";
import { CRAFT_VIEWER_URL } from "../../config/keys";
import { useStore } from "../../store";
import { fileApi } from "../../apiActions/fileApi";
import { AlertMsgType } from "../../store/actionSlice";

interface CraftViewerProps {
  itemId: string;
}

const CraftViewer = ({ itemId }: CraftViewerProps) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  useEffect(() => {
    getDownloadUrl();
  }, []);

  const getDownloadUrl = async () => {
    const { data: url, error } = await fileApi.downloadFile(itemId);

    if (error) {
      return setDialogBoxMsg(error, AlertMsgType.ERROR);
    }

    setDownloadUrl(url);
  };

  return (
    <Box style={{ width: "100%", height: "100%" }}>
      <iframe
        style={{ width: "100%", height: "100%" }}
        // src={`${CRAFT_VIEWER_URL}?reportId=${itemId}&workspaceId=${selectedWorkspaceId}`}
        src={`${CRAFT_VIEWER_URL}?file=${encodeURIComponent(downloadUrl)}`}
        title="Report Viewer"
      />
    </Box>
  );
};

export default CraftViewer;
