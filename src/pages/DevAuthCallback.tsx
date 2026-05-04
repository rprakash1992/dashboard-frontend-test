import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { handleOAuthCallback } from "../utils/devAuth";

export const DevAuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      setError("No authorization code in callback URL.");
      return;
    }
    handleOAuthCallback(code)
      .then(() => navigate("/", { replace: true }))
      .catch((err) => setError(err.message));
  }, [navigate]);

  if (error) return <div style={{ padding: 32 }}>Auth error: {error}</div>;
  return <div style={{ padding: 32 }}>Completing sign-in...</div>;
};
