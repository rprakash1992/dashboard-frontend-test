import { useEffect, useState } from "react";

// import { useStore } from "../../store";
import { AllActivities } from "./AllActivities";
import { itemApi } from "../../apiActions/itemApi";
import { useStore } from "../../store";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";
import { userProfileApi } from "../../apiActions/userProfileApi";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";
import { AlertMsgType } from "../../store/actionSlice";
// import { generateUniqueId } from "../../utils/misc";

// function onlyUnique(value: any, index: number, array: any[]) {
//   return array.indexOf(value) === index;
// }

export interface ActivityType {
  id: string;
  item_id: string;
  prev_action: string;
  user_id: string;
  timestamp: string;
  activity_type: string;
  content: any;
}

const ItemActivity = ({ itemId }: { itemId: string }) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  // const user = useStore((state) => state.user);
  // const selectedWorkspace = useStore((state) => state.selectedWorkspace);
  // const appPermissions = useStore((state) => state.appPermissions);
  // const itemsMetadata = useStore((state) => state.itemsMetadata);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [profileDetails, setProfileDetails] = useState<any>({});
  // const selectedCustomTabItem = itemsMetadata.find(
  //   (item) => String(item.id) === String(itemId)
  // );

  useEffect(() => {
    // setActivities([]);
    if (itemId) {
      fetchActivities(itemId);
    }
  }, [itemId]);

  const fetchActivities = async (id: string) => {
    const { data: itemsData, error: itemsError } = await itemApi?.getItemByIds([
      id,
    ]);

    if (itemsError) {
      setLoading(false);
      return setDialogBoxMsg(itemsError, AlertMsgType.ERROR);
    }

    if (itemsData && itemsData.length > 0) {
      const item = itemsData[0];
      const itemType = item.item_type;
      const { data, error } = await itemApi?.fetchItemActivities(id, itemType);
      if (error) {
        setLoading(false);
        return setDialogBoxMsg(error, AlertMsgType.ERROR);
      }

      const userIds = data.map((d: any) => d.user_id);
      const uniqueUserIds = userIds.filter(
        (value: string, index: number, array: string[]) => {
          return array.indexOf(value) === index;
        }
      );

      const profileDetailsObj: any = {};

      if (uniqueUserIds.length > 0) {
        const { data: profilesData, error: profilesError } =
          await userProfileApi.getUserProfiles(uniqueUserIds);

        if (profilesError) {
          setDialogBoxMsg(profilesError, AlertMsgType.ERROR);
        }

        profilesData.forEach((profile: any) => {
          profileDetailsObj[profile.id] = profile;
        });

        setProfileDetails(profileDetailsObj);
      }

      setActivities(data ?? []);
    }
    setLoading(false);
  };

  const onAddCommentClick = (ele: any, contentType: string) => {
    console.log({ele, contentType})
    // if (appPermissions?.comment) {
    //   const prevActivity = {
    //     id: generateUniqueId(),
    //     item_id: ele?.item_id,
    //     prev_action: ele?.id,
    //     content: {
    //       text: ele?.content?.text,
    //       contentType,
    //       time: ele?.content?.time,
    //       userId: user?.id,
    //     },
    //   };
    //   setActivities([...activities, prevActivity]);
    // } else {
    //   setDialogBoxMsg(
    //     "You are not authorized to comment on this item",
    //     "error"
    //   );
    // }
  };

  const onCancelAddCommentClick = (act: any) => {
    const acts = activities.filter((d) => d !== act);
    setActivities(acts);
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    prevActId: any,
    comment: string,
    contentType: string,
    postComment?: string
  ) => {
    console.log({e, prevActId, comment, contentType, postComment})
    // if (!comment) return;
    // if (e?.key === "Enter" || postComment) {
    //   const activityPayload = {
    //     item_id: selectedCustomTabItem?.id,
    //     prev_action: prevActId,
    //     content: {
    //       text: comment,
    //       contentType,
    //       userId: user?.id,
    //       time: new Date(),
    //     },
    //   };
    //   const { data: commentResp, error } = await itemApi?.insertNewComment(
    //     selectedCustomTabItem?.id,
    //     selectedWorkspace?.id ?? null,
    //     [activityPayload]
    //   );
    //   if (error) {
    //     return setDialogBoxMsg(error, AlertMsgType.ERROR);
    //   }
    //   if (commentResp) {
    //     fetchActivities();
    //   }
    // }
  };

  return (
    <MaxWidthContainer>
      {loading ? (
        <LoadingComponent />
      ) : (
        <AllActivities
          activities={activities}
          profileDetails={profileDetails}
          onAddCommentClick={onAddCommentClick}
          onCancelAddCommentClick={onCancelAddCommentClick}
          handleKeyDown={handleKeyDown}
        />
      )}
    </MaxWidthContainer>
  );
};

export default ItemActivity;
