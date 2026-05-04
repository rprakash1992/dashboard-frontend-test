import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useStore } from "../store";
import { viewApi } from "../apiActions/viewApi";
import { tagsApi } from "../apiActions/tagsApi";
import { userProfileApi } from "../apiActions/userProfileApi";
import { itemApi } from "../apiActions/itemApi";
import { workspaceApi } from "../apiActions/workspaceApi";
import { RouteItemTypesEnums } from "../data/gui/RouteEnums";
import { AlertMsgType } from "../store/actionSlice";
import { storageApi } from "../apiActions/storageApi";

export const useAppBootstrap = () => {
  const setViewPropertiesItem = useStore(
    (state) => state.setViewPropertiesItem,
  );
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const setTags = useStore((state) => state.setTags);
  const setMyWorkspaces = useStore((state) => state.setMyWorkspaces);
  const setSelectedWorkspace = useStore((state) => state.setSelectedWorkspace);
  const setUserProfile = useStore((state) => state.setUserProfile);
  const setProfilePending = useStore((state) => state.setProfilePending);
  const setAllRoles = useStore((state) => state.setAllRoles);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  const { pathname, search } = useLocation();

  useEffect(() => {
    localStorage?.removeItem("vc-dashboard-workspace");
    fetchViews();
    fetchTags();
    fetchMyWorkspaces();
  }, []);

  const fetchViews = async () => {
    const viewType = RouteItemTypesEnums[pathname] ?? "file";

    const { data: viewsData, error } = await viewApi?.getDashboardViews();

    if (error) {
      return setDialogBoxMsg(error, AlertMsgType.ERROR);
    }

    if (viewsData?.length > 0) {
      const activeView = viewsData?.find(
        (i: any) => i?.title === "All" && i?.item_type === viewType,
      );

      setViewPropertiesItem(viewsData);

      if (
        activeView &&
        !(search.includes("tabId") && search.includes("tabTitle"))
      ) {
        navigate(
          `files?tabId=${activeView.id}&tabTitle=${activeView.title}&itemId=${activeView.id}`,
        );
      }
    }
  };

  const fetchTags = async () => {
    const { data, error } = await tagsApi.fetchTags();

    if (error) {
      setDialogBoxMsg(error, AlertMsgType.ERROR);
    } else {
      setTags(data);
    }
  };

  const fetchUserProfile = async () => {
    const { data: profile, error } =
      await userProfileApi.getUserProfile("my-profile");

    if (error) {
      setDialogBoxMsg(error, AlertMsgType.ERROR);
    } else {
      if (profile) {
        const { data: downloadUrl } = await storageApi.getImageDownloadUrl(
          profile.pitcure,
        );

        if (downloadUrl) {
          setUserProfile({
            ...profile,
            picture: downloadUrl,
          });
        } else {
          setUserProfile(profile);
        }
        setProfilePending(profile?.status === "pending");
      } else {
        setProfilePending(true);
      }
    }
  };

  const fetchRoles = async () => {
    const { data, error } = await itemApi.fetchDashboardItems("role");

    if (error) {
      setDialogBoxMsg(error, AlertMsgType.ERROR);
    } else {
      const rolesObj: any = {};
      data.forEach((role: any) => {
        rolesObj[role?.id] = role;
      });

      setAllRoles(data);
    }
  };

  const fetchMyWorkspaces = async () => {
    const { data, error } = await workspaceApi?.fetchMyWorkspaces();

    if (error) {
      setDialogBoxMsg(error, AlertMsgType.ERROR);
      setLoading(false);
      return;
    }

    setMyWorkspaces(data);
    if (data.length > 0) {
      const vcDashboardWorkspace = localStorage?.getItem(
        "vc-dashboard-workspace",
      );
      const ws = vcDashboardWorkspace
        ? JSON.parse(vcDashboardWorkspace)
        : data[0];
      setSelectedWorkspace(ws);
      localStorage.setItem("vc-dashboard-workspace", JSON.stringify(ws));
    }
    setLoading(false);
    fetchUserProfile();
    fetchRoles();
  };

  return { loading };
};
