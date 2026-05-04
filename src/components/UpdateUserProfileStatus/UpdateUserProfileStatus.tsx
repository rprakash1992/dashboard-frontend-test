import { useEffect, useState } from "react";
import { Flex, Select } from "@mantine/core";
import { useStore } from "../../store";
import { userProfileApi } from "../../apiActions/userProfileApi";
import { SubmitButton } from "../common/SubmitButton/SubmitButton";
import { AlertMsgType } from "../../store/actionSlice";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";

interface UpdateUserProfileStatusProps {
  itemId: string;
}

const UpdateUserProfileStatus = ({ itemId }: UpdateUserProfileStatusProps) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [loadingUpdateStatus, setLoadingUpdateStatus] =
    useState<boolean>(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState<boolean>(true);
  const userProfileId = itemId;

  useEffect(() => {
    if (userProfileId) {
      fetchUserProfile(userProfileId);
    }
  }, [userProfileId]);

  const fetchUserProfile = async (userId: string) => {
    try {
      setIsFetchingProfile(true);
      const { data, error } = await userProfileApi.getUserProfile(userId);

      if (error) {
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (data) {
        setSelectedStatus(data?.status);
      }
    } catch (error) {
      setDialogBoxMsg(String(error), AlertMsgType.ERROR);
    } finally {
      setIsFetchingProfile(false);
    }
  };

  const onUpdate = async () => {
    try {
      if (!selectedStatus) {
        return setDialogBoxMsg("Select profile status.", AlertMsgType.ERROR);
      }

      if (!userProfileId) {
        return setDialogBoxMsg("Select user profile.", AlertMsgType.ERROR);
      }

      setLoadingUpdateStatus(true);
      const { error } = await userProfileApi.updateUserProfile(
        userProfileId,
        "status",
        selectedStatus,
      );

      if (error) {
        setLoadingUpdateStatus(false);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      setDialogBoxMsg("Status updated", AlertMsgType.SUCCESS);
      setLoadingUpdateStatus(false);
    } catch (err) {
      setDialogBoxMsg(String(err), AlertMsgType.ERROR);
      setLoadingUpdateStatus(false);
    }
  };

  if (isFetchingProfile) {
    return <LoadingComponent />;
  }

  return (
    <MaxWidthContainer>
      <Flex p="xs" h="100%" direction="column" justify="flex-end">
        <Select
          label="Status:"
          placeholder="Select Status"
          value={selectedStatus}
          data={["active", "pending"]}
          nothingFoundMessage="No role found..."
          onChange={setSelectedStatus}
          checkIconPosition="right"
          mb="xs"
          mt={0}
        />
        <SubmitButton
          isLoading={loadingUpdateStatus}
          isDisabled={loadingUpdateStatus}
          label="Update"
          onSubmit={onUpdate}
        />
      </Flex>
    </MaxWidthContainer>
  );
};

export default UpdateUserProfileStatus;
