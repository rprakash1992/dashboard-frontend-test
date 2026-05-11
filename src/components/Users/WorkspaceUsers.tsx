import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Flex, Select } from "@mantine/core";
import debounce from "lodash/debounce";
import { useStore } from "../../store";
import { InfoPanel } from "../InfoPanel";
import { userProfileApi } from "../../apiActions/userProfileApi";
// import { itemApi } from "../../apiActions/itemApi";
import type { ItemMetadataType } from "../../types";
import { workspaceApi } from "../../apiActions/workspaceApi";
import { AlertMsgType } from "../../store/actionSlice";
// import { getWorkspaceId } from "../../utils/getWorkspaceId";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";
import { SubmitButton } from "../common/SubmitButton/SubmitButton";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { ButtonGroup } from "../CustomComponents/ButtonGroup";

interface WorkspaceUsersProps {
  itemId: string;
}

interface WorkspaceUser {
  user: ItemMetadataType;
  role: ItemMetadataType;
}

export const WorkspaceUsers = ({ itemId }: WorkspaceUsersProps) => {
  const allRoles = useStore((state) => state.allRoles);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  // const myWorkspaces = useStore((state) => state.myWorkspaces);
  const [loadingAddUser, setLoadingAddUser] = useState<boolean>(false);
  const [workspaceUsers, setWorkspaceUsers] = useState<WorkspaceUser[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchData, setSearchData] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isFetchingUsers, setIsFecthingUsers] = useState<boolean>(true);
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState<boolean>(false);
  // const workspaceId = getWorkspaceId();

  // const selectedWorkspace = myWorkspaces.find(
  //   (ws) => String(ws.id) === String(workspaceId),
  // );

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
    if (searchValue && !isUpdateMode) {
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
      // const { data, error } = await itemApi.fetchDashboardItems("user_profile");
      const { data, error } = await workspaceApi.fetchWorkspaceUsers(itemId);

      if (error) {
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      setWorkspaceUsers(data);
    } catch (error) {
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
        itemId,
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

  const handleUserClick = (user: ItemMetadataType, role: ItemMetadataType) => {
    console.log({ user });
    setSearchValue(user.title);
    setSelectedUserId(user.id);
    setSelectedRoleId(role.id);
    setIsUpdateMode(true);
  };

  const handleCancelUpdate = () => {
    setSearchValue("");
    setSelectedUserId(null);
    setSelectedRoleId(null);
    setIsUpdateMode(false);
  };

  const handleUpdateRole = async () => {
    if (!selectedUserId) {
      return setDialogBoxMsg("Select a user", AlertMsgType.ERROR);
    }
    if (!selectedRoleId) {
      return setDialogBoxMsg("Select a role", AlertMsgType.ERROR);
    }

    try {
      setIsUpdatingRole(true);
      const { data, error } = await workspaceApi.updateWorkspaceUserRole(
        itemId,
        selectedUserId,
        selectedRoleId,
      );

      if (error) {
        return setDialogBoxMsg(String(error), AlertMsgType.ERROR);
      }

      const user: ItemMetadataType = data.user;
      const role: ItemMetadataType = data.role;

      setWorkspaceUsers((prev) =>
        prev.map((ws) => {
          if (String(ws.user.id) === String(user.id)) {
            return {
              user,
              role,
            };
          } else {
            return ws;
          }
        }),
      );
      setSelectedUserId(null);
      setSearchValue("");
      // setSelectedRoleId(null);
      setIsUpdateMode(false);
      setDialogBoxMsg("Role updated successfully.", AlertMsgType.SUCCESS);
    } catch (error) {
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  if (isFetchingUsers) {
    return <LoadingComponent />;
  }

  return (
    <MaxWidthContainer>
      <Flex p="xs" h="100%" direction="column" justify="space-between">
        <Box>
          {workspaceUsers.map(({ user, role }) => (
            <InfoPanel
              keyName={user.id}
              title={user.title}
              subTitle={role.title}
              showCheckIcon={false}
              showCrossIcon={false}
              onClick={() => handleUserClick(user, role)}
            />
          ))}
        </Box>
        {/* {selectedWorkspace?.system_key !== "user_personal_workspace" && ( */}
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
          {isUpdateMode ? (
            <ButtonGroup
              loading={isUpdatingRole}
              primaryText="Update"
              secondaryText="Cancel"
              onPrimaryClick={handleUpdateRole}
              onSecondaryClick={handleCancelUpdate}
            />
          ) : (
            <SubmitButton
              label="Add"
              onSubmit={addUser}
              isLoading={loadingAddUser}
              isDisabled={loadingAddUser}
            />
          )}
        </Box>
        {/* )} */}
      </Flex>
    </MaxWidthContainer>
  );
};
