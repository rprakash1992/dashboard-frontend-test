import { Box } from "@mantine/core";

import { ENTERPRISE_VIEWER_URL } from "../../config/keys";
import { useStore } from "../../store";
import { useEffect, useState } from "react";
import { fileApi } from "../../apiActions/fileApi";
import { AlertMsgType } from "../../store/actionSlice";
import { useLocation } from "react-router";
import { parseQuery } from "../../utils/parseQuery";

const serverurl = "https://oonodkhsxgxoxaiwdrvp.supabase.co";
const apikey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vbm9ka2hzeGd4b3hhaXdkcnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA3ODMwOTgsImV4cCI6MTk5NjM1OTA5OH0.Dtp-tlezahlMdUcie0q7hbD4Ct7Y4Ivd3awT-zcFnF8";
const roleid = "analyst";
const reportid = "1s";
const api =
  "http%3A%2F%2Fec2-54-88-72-27.compute-1.amazonaws.com%3A8080%2Fapi%2F1.0%2Fmodel";
// const url =
  // "file%3A%2F%2FC%3A%5Cserver%5Centerprise-1.1-win64%5Csamples%5Cbeam.cax#/";

// const src = `${ENTERPRISE_VIEWER_URL}?serverurl=${serverurl}&apikey=${apikey}&roleid=${roleid}&reportid=${reportid}&api=${api}&url=${url}`;

const EnterpriseViewer = () => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const location = useLocation();
  const { search } = location;
  const parsedQuery = parseQuery(search);
  const { fileId } = parsedQuery;

  useEffect(() => {
    getDownloadUrl();
  }, []);

  const getDownloadUrl = async () => {
    const { data: url, error } = await fileApi.downloadFile(String(fileId));

    if (error) {
      return setDialogBoxMsg(error, AlertMsgType.ERROR);
    }

    setDownloadUrl(url);
  };

  const src = `${ENTERPRISE_VIEWER_URL}?serverurl=${serverurl}&apikey=${apikey}&roleid=${roleid}&reportid=${reportid}&api=${api}&url=${downloadUrl}`;

  if (!downloadUrl) return null;

  return (
    <Box style={{ width: "100%", height: "100%" }}>
      <iframe
        style={{ width: "100%", height: "100%" }}
        // src={`${ENTERPRISE_VIEWER_URL}`}
        src={src}
        title="Enterprise Viewer"
      />
    </Box>
  );
};

export default EnterpriseViewer;
