import { useState } from "react";
import { Flex } from "@mantine/core";
import { useStore } from "../../store";
import { getRandomImageName } from "../../utils/getRandomImageName";
import { userProfileApi } from "../../apiActions/userProfileApi";
import { storageApi } from "../../apiActions/storageApi";
// import { baseProfileImageUrl } from "../../utils/misc";
import { AlertMsgType } from "../../store/actionSlice";
import { ProfileImageTop } from "./ProfileImageTop";
import { ProfileImageBottom } from "./ProfileImageBottom";

export const ProfileImage = () => {
  const userProfile = useStore((state) => state.userProfile);
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  const setUserProfile = useStore((state) => state.setUserProfile);
  // const [imgLoading, setImgLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  const handleImageUpload = async (files: FileList | null) => {
    try {
      if (!files || files.length <= 0) {
        return setDialogBoxMsg("Select an image.", AlertMsgType.ERROR);
      }

      setIsUploading(true);
      const file = files[0];
      const fileName = file?.name;
      const fileKey = getRandomImageName(fileName);
      // const folderName = "profile-images";

      const contentType = file.type || "application/octet-stream";

      const { data: signed_url, error } = await storageApi.getImageUploadUrl(
        // folderName
        fileKey,
        contentType,
      );

      if (error) {
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (!signed_url) {
        return setDialogBoxMsg("No upload url found.", AlertMsgType.ERROR);
      }

      const newFile = new File([file], fileKey, { type: contentType });

      await fetch(signed_url, {
        method: "PUT",
        body: newFile,
        headers: { "Content-Type": contentType },
      });

      // const fileUrl = `${baseProfileImageUrl}/${fileKey}`;

      const { data: updateProfileData, error: updateProfileErr } =
        await userProfileApi.updateUserProfile(
          userProfile.id,
          "picture",
          fileKey,
          // fileUrl,
        );

      if (updateProfileErr) {
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      if (updateProfileData) {
        // const newProfile = updateProfileData[0];
        // setUserProfile(updateProfileData);
        const { data: downloadUrl, error: downloadUrlErr } =
          await storageApi.getImageDownloadUrl(fileKey);

        if (downloadUrlErr) {
          return setDialogBoxMsg(downloadUrlErr, AlertMsgType.ERROR);
        }
        setUserProfile({
          ...updateProfileData,
          picture: downloadUrl,
        });
      }
    } catch (err) {
      setDialogBoxMsg(String(err), AlertMsgType.ERROR);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsRemoving(true);
      const { data: updateProfileData, error: updateProfileErr } =
        await userProfileApi.updateUserProfile(userProfile.id, "picture", null);

      if (updateProfileErr) {
        return setDialogBoxMsg(updateProfileErr, AlertMsgType.ERROR);
      }

      if (updateProfileData) {
        // const updatedProfile = updateProfileData[0];
        setUserProfile(updateProfileData);
      }
    } catch (error) {
      setDialogBoxMsg("Eomething went wrong.", AlertMsgType.ERROR);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleLogout = async () => {
    if (window.electronAPI) {
      window.electronAPI.logout();
      return;
    }
    window.location.href =
      "/oauth2/sign_out?rd=" + encodeURIComponent(window.location.origin);
  };

  return (
    <Flex
      gap="xs"
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
      p="10px"
    >
      <ProfileImageTop handleLogout={handleLogout} />
      <ProfileImageBottom
        profilePicture={userProfile.picture}
        isUploading={isUploading}
        isRemoving={isRemoving}
        handleImageUpload={handleImageUpload}
        handleRemoveImage={handleRemoveImage}
      />
    </Flex>
  );
};
