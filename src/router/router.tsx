import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { useMantineColorScheme } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { DialogBox } from "../components/DialogBox";
import { PageNotFound } from "./PageNotFound";
import { AppLayout } from "../components/AppLayout/AppLayout";
import { DevAuthCallback } from "../pages/DevAuthCallback";
import { isDevMode } from "../config/keys";
import { getDevToken, redirectToGoogleLogin } from "../utils/auth";

export const Router = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const matchesDarkTheme = window?.matchMedia(
    "(prefers-color-scheme: dark)",
  )?.matches;

  useEffect(() => {
    if (matchesDarkTheme) {
      setColorScheme("dark");
      window?.electronAPI?.setTheme("dark");
    } else {
      setColorScheme("light");
      window?.electronAPI?.setTheme("dark");
    }
  }, [matchesDarkTheme]);

  // In dev mode, require a Google access token before rendering the app.
  // Redirect to Google login if none is present.
  useEffect(() => {
    if (!isDevMode) return;
    if (window.location.pathname === "/auth/callback") return;
    if (!getDevToken()) {
      redirectToGoogleLogin();
    }
  }, []);

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
    window?.electronAPI?.setTheme(colorScheme === "dark" ? "light" : "dark");
  };

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<></>} />
          <Route path="files" element={<></>} />
          <Route path="projects" element={<></>} />
          <Route path="reports" element={<></>} />
          <Route path="users" element={<></>} />
          <Route path="workspaces" element={<></>} />
          <Route path="roles" element={<></>} />
          <Route path="jobs" element={<></>} />
          <Route path="workflows" element={<></>} />
          <Route path="my-profile" element={<></>} />
          <Route path="my-workspaces" element={<></>} />
          <Route path="item-info" element={<></>} />
          <Route path="item-traceability" element={<></>} />
          <Route path="item-activity" element={<></>} />
          <Route path="item-share" element={<></>} />
          <Route path="view-filter" element={<></>} />
          <Route path="view-sort" element={<></>} />
          <Route path="view-activity" element={<></>} />
          <Route path="workspace-users" element={<></>} />
          <Route path="user-status" element={<></>} />
          <Route path="new-file" element={<></>} />
          <Route path="new-project" element={<></>} />
          <Route path="new-report" element={<></>} />
          <Route path="new-workspace" element={<></>} />
          <Route path="epviewer" element={<></>} />
          <Route path="wcxviewer" element={<></>} />
          <Route path="cftviewer" element={<></>} />
          <Route path="mediaviewer" element={<></>} />
          <Route path="create-job" element={<></>} />
          <Route path="job-info" element={<></>} />
          <Route path="create-workflow" element={<></>} />
          <Route path="ai-assistant" element={<></>} />
          <Route path="permissions" element={<></>} />
        </Route>
        <Route path="auth/callback" element={<DevAuthCallback />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <DialogBox />
    </BrowserRouter>
  );
};
