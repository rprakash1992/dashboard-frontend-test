import { FRONTEND_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../config/keys";

// const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
// const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET as string;
// const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
// const REDIRECT_URI = "http://localhost:5173/auth/callback";
const REDIRECT_URI = `${FRONTEND_URL}/auth/callback`;
const TOKEN_KEY = "dev_access_token";

export function getDevToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearDevToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function redirectToGoogleLogin(): void {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("access_type", "online");
  url.searchParams.set("prompt", "select_account");

  window.location.href = url.toString();
}

export async function handleOAuthCallback(code: string): Promise<void> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Token exchange failed: ${res.status} — ${body.error}: ${body.error_description}`);
  }

  const data = await res.json();
  localStorage.setItem(TOKEN_KEY, data.access_token);
}
