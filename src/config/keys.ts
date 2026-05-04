// const isElectron = navigator.userAgent.includes("Electron");
const mode = import.meta.env.VITE_MODE;
const serverUrl = import.meta.env.VITE_API_SERVER_URL;
const serverUrlV1 = import.meta.env.VITE_API_SERVER_V1;
const enterpriseViewerUrl = import.meta.env.VITE_ENTERPRISE_URL;
const craftViewerUrl = import.meta.env.VITE_CRAFT_VIEWER_URL;
const wcaxViewerUrl = import.meta.env.VITE_WCAXVIEWER_URL;
const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleClientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

export const isDevMode = mode === "local";
export const API_SERVER_URL = serverUrl;
export const ENTERPRISE_VIEWER_URL = enterpriseViewerUrl;
export const CRAFT_VIEWER_URL = craftViewerUrl;
export const WCAXVIEWER_URL = wcaxViewerUrl;
export const API_SERVER_V1 = serverUrlV1;
export const FRONTEND_URL = frontendUrl;
export const GOOGLE_CLIENT_ID = googleClientId;
export const GOOGLE_CLIENT_SECRET = googleClientSecret;
// export { isDevMode };

// export const API_SERVER_URL = "/server";
// export const WCAXVIEWER_URL = "/wcaxviewer";
// export const ENTERPRISE_VIEWER_URL = "/enterpriseviewer";
// export const CRAFT_VIEWER_URL = "/craftviewer";
// export const API_SERVER_V1 = "http://localhost/server/api/v1";
