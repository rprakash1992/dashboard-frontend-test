interface CallApiProps {
  URL: string | URL;
  METHOD?: string;
  HEADERS?: any;
  BODY?: any;
  SIGNAL?: AbortSignal;
}

export const CallApi = async function ({
  URL,
  METHOD,
  HEADERS,
  BODY,
  SIGNAL,
}: CallApiProps) {
  const response = await fetch(URL, {
    headers: {
      ...HEADERS,
      "Cache-Control": "no-cache",
    },
    method: METHOD,
    body: JSON.stringify(BODY),
    signal: SIGNAL,
  });

  if (response.status === 401) {
    // means auth cookie has expired, need to authenticate again
    window.location.href = "/oauth2/start"; // Re-authenticate
  } else {
    const jsonResponse = await response?.json();
    return jsonResponse;
  }
};
