import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Flex, Select } from "@mantine/core";
import debounce from "lodash/debounce";
import { useStore } from "../../store";
import { InfoPanel } from "../InfoPanel";
import { userProfileApi } from "../../apiActions/userProfileApi";
import { itemApi } from "../../apiActions/itemApi";
import type { ItemMetadataType } from "../../types";
import { workspaceApi } from "../../apiActions/workspaceApi";
import { AlertMsgType } from "../../store/actionSlice";
import { getWorkspaceId } from "../../utils/getWorkspaceId";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";
import { SubmitButton } from "../common/SubmitButton/SubmitButton";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";

interface WorkspaceUsersProps {
  itemId: string;
}

export const WorkspaceUsers = ({ itemId }: WorkspaceUsersProps) => {
  const allRoles = useStore((state) => state.allRoles);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const myWorkspaces = useStore((state) => state.myWorkspaces);
  const [loadingAddUser, setLoadingAddUser] = useState<boolean>(false);
  const [workspaceUsers, setWorkspaceUsers] = useState<ItemMetadataType[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchData, setSearchData] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isFetchingUsers, setIsFecthingUsers] = useState<boolean>(true);
  const workspaceId = getWorkspaceId();

  const selectedWorkspace = myWorkspaces.find(
    (ws) => String(ws.id) === String(workspaceId),
  );

  const roleData = useMemo(
    () => allRoles.map((role) => ({ label: role.title, value: role.id })),
    [allRoles],
  );

  useEffect(() => {
    if (itemId) {
      getWorkspaceUsers();
    }
  }, [itemId]);

  useEffect(() => {
    if (searchValue) {
      setIsSearching(true);
      debouncedSearch(searchValue);
    } else {
      setIsSearching(false);
      setSearchData([]);
    }
  }, [searchValue]);

  const getWorkspaceUsers = async () => {
    try {
      setIsFecthingUsers(true);
      const { data, error } = await itemApi.fetchDashboardItems("user_profile");

      if (error) {
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      setWorkspaceUsers(data);
    } catch (error) {
      console.error(error);
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setIsFecthingUsers(false);
    }
  };

  const searchUsers = async (searchValue: string) => {
    try {
      const { data, error } =
        await userProfileApi.searchUserProfiles(searchValue);

      if (error) {
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      const transformedData = data.map((userProfile: any) => ({
        label: `${userProfile.name} (${userProfile.email})`,
        value: userProfile.id,
      }));

      setSearchData(transformedData);
    } catch (err) {
      setDialogBoxMsg(String(err), AlertMsgType.ERROR);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(debounce(searchUsers, 400), []);

  const addUser = async () => {
    try {
      if (!selectedUserId) {
        return setDialogBoxMsg("Select a user.", AlertMsgType.ERROR);
      }

      if (!itemId) {
        return setDialogBoxMsg("No workspace selected.", AlertMsgType.ERROR);
      }

      if (!selectedRoleId) {
        return setDialogBoxMsg("Select a role.", AlertMsgType.ERROR);
      }

      setLoadingAddUser(true);

      const { error, data } = await workspaceApi.addUserToWorkspace(
        selectedUserId,
        selectedRoleId,
      );

      if (error) {
        return setDialogBoxMsg(String(error), AlertMsgType.ERROR);
      }

      setWorkspaceUsers([...workspaceUsers, data]);
      setSelectedUserId(null);
      setSearchValue("");
      setDialogBoxMsg("User added to workspace.", AlertMsgType.SUCCESS);
    } catch (err) {
      setDialogBoxMsg(String(err), AlertMsgType.ERROR);
    } finally {
      setLoadingAddUser(false);
    }
  };

  if (isFetchingUsers) {
    return <LoadingComponent />;
  }

  return (
    <MaxWidthContainer>
      <Flex p="xs" h="100%" direction="column" justify="space-between">
        <Box>
          {workspaceUsers.map((workspaceUser) => (
            <InfoPanel
              keyName={workspaceUser.id}
              title={workspaceUser.title}
              showCheckIcon={false}
              showCrossIcon={false}
            />
          ))}
        </Box>
        {selectedWorkspace?.system_key !== "user_personal_workspace" && (
          <Box>
            <Select
              label="User:"
              placeholder="Search user..."
              data={searchData}
              searchable
              nothingFoundMessage={
                isSearching ? "Searching..." : "No user found..."
              }
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onChange={setSelectedUserId}
              checkIconPosition="right"
              mb="10px"
              mt={0}
            />
            <Select
              label="Role:"
              placeholder="Select Role"
              data={roleData}
              nothingFoundMessage="No role found..."
              onChange={setSelectedRoleId}
              checkIconPosition="right"
              mb="10px"
              mt={0}
            />
            <SubmitButton
              label="Add"
              onSubmit={addUser}
              isLoading={loadingAddUser}
              isDisabled={loadingAddUser}
            />
          </Box>
        )}
      </Flex>
    </MaxWidthContainer>
  );
};
