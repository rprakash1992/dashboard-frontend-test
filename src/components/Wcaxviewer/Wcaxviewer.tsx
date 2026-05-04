import { useEffect, useState } from "react";
import { Box } from "@mantine/core";

import { WCAXVIEWER_URL } from "../../config/keys";
import { useStore } from "../../store";
import { fileApi } from "../../apiActions/fileApi";
import { AlertMsgType } from "../../store/actionSlice";

interface WcaxviewerProps {
  itemId: string;
}

const Wcaxviewer = ({ itemId }: WcaxviewerProps) => {
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
  return downloadUrl ? (
    <Box style={{ width: "100%", height: "100%" }}>
      <iframe
        style={{ width: "100%", height: "100%" }}
        src={`${WCAXVIEWER_URL}?file=${encodeURIComponent(downloadUrl)}`}
        title="WcaxViewer"
      />
    </Box>
  ) : null;
};

export default Wcaxviewer;
