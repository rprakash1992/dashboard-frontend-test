import { getDevToken, redirectToGoogleLogin, clearDevToken } from "./auth";
import { isDevMode, isProdMode } from "../config/keys";

interface CallApiProps {
  URL: string | URL;
  METHOD?: string;
  HEADERS?: any;
  BODY?: any;
  SIGNAL?: AbortSignal;
}

async function getToken(): Promise<string | null> {
  if (window.electronAPI) {
    return await window.electronAPI.getAccessToken();
  }
  if (isDevMode) {
    return getDevToken();
  }
  return null;
}

export const CallApiNew = async function ({
  URL,
  METHOD,
  HEADERS,
  BODY,
  SIGNAL,
}: CallApiProps) {
  const token = await getToken();
  const response = await fetch(URL, {
    headers: {
      ...HEADERS,
      "Cache-Control": "no-cache",
      ...(token ? { "X-Auth-Request-Access-Token": token } : {}),
      ...(token ? { "X-Amzn-Oidc-Accesstoken": token } : {}),
    },
    method: METHOD,
    body: JSON.stringify(BODY),
    signal: SIGNAL,
  });

  // if (response.status === 401) {
  //   // means auth cookie has expired, need to authenticate again
  //   window.location.href = "/oauth2/start"; // Re-authenticate
  //   return { data: null, error: "Unauthorized" }
  // } else if (response.status >= 200 && response.status <= 399) {
  //   const jsonResponse = await response?.json();
  //   return { data: jsonResponse, error: null };
  // } else {
  //   const jsonResponse = await response?.json();
  //   return { data: null, error: jsonResponse.detail };
  // }
  if (response.status === 401) {
    if (isDevMode) {
      clearDevToken();
      redirectToGoogleLogin();
    } else if (isProdMode) {
      clearDevToken();
      redirectToGoogleLogin();
    } else {
      window.location.href = "/oauth2/start";
    }
    return { data: null, error: "Unauthorized" };
  } else if (response.status >= 200 && response.status <= 399) {
    const jsonResponse = await response?.json();
    return { data: jsonResponse, error: null };
  } else {
    const jsonResponse = await response?.json();
    return { data: null, error: jsonResponse.detail };
  }
};
