const isElectron = navigator.userAgent.includes("Electron");
const isDevMode = import.meta.env.VITE_DEV_MODE === "true";
const serverUrl = import.meta.env.VITE_API_SERVER_URL;

export const API_SERVER_URL = isElectron || isDevMode
  ? `${serverUrl}/api/v1`
  : "/server";

export const ENTERPRISE_VIEWER_URL = isElectron
  ? "http://localhost:3001/enterpriseviewer"
  : "/enterpriseviewer";

export const CRAFT_VIEWER_URL = isElectron
  ? "http://localhost:3002/craftviewer"
  : "/craftviewer";

export const WCAXVIEWER_URL = isElectron
  ? "http://localhost:3003"
  : "/wcaxviewer";

export const API_SERVER_V1 = isElectron || isDevMode
  ? `${serverUrl}/api/v1`
  : "http://localhost/server/api/v1";

export { isElectron, isDevMode };

// export const API_SERVER_URL = "/server";
// export const WCAXVIEWER_URL = "/wcaxviewer";
// export const ENTERPRISE_VIEWER_URL = "/enterpriseviewer";
// export const CRAFT_VIEWER_URL = "/craftviewer";
// export const API_SERVER_V1 = "http://localhost/server/api/v1";
