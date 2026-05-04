import { useState } from "react";
import { Box } from "@mantine/core";

import { useStore } from "../../store";
import { ActivityCard } from "./AcrivityCard";
import type { ViewActivityType } from "../../store/viewSlice";

const ViewsActivity = ({ viewId }: { viewId: string }) => {
  const userProfile = useStore((state) => state.userProfile);
  const [activities] = useState<any>([]);
  console.log({ viewId });
  // useEffect(() => {
  //   fetchActivities();
  // }, [selectedCustomTabItem]);

  // const fetchActivities = async () => {};

  return (
    <Box p="10px">
      {activities.map((ele: ViewActivityType) => (
        <ActivityCard key={ele?.id} ele={ele} profileDetails={userProfile} />
      ))}
    </Box>
  );
};

export default ViewsActivity;
