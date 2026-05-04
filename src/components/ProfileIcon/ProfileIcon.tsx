import { Avatar } from "@mantine/core";

import { useStore } from "../../store";

export const ProfileIcon = () => {
  const userProfile = useStore((state) => state.userProfile);

  return <Avatar src={userProfile?.picture} size="xs" radius="lg" m="3px" />;
};
