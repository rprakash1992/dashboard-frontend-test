import { Box, Divider, useMantineColorScheme } from "@mantine/core";
import { ProfileImage } from "./ProfileImage";
import { PersonalInfo } from "./PersonalInfo";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";

const UserProfile = () => {
  const { colorScheme } = useMantineColorScheme();
  const dividerColor = colorScheme === "dark" ? "inherit" : "#CED4DA";

  return (
    <MaxWidthContainer>
      <Box>
        <ProfileImage />
        <Divider color={dividerColor} />
        <PersonalInfo />
        <Divider color={dividerColor} />
      </Box>
    </MaxWidthContainer>
  );
};

export default UserProfile;
