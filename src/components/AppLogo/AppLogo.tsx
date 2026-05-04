import { Box, Image, useMantineColorScheme } from "@mantine/core";

import LogoWhite from "../../assets/images/logoWhite.png";
import LogoBlack from "../../assets/images/logoBlack.png";

export const AppLogo = () => {
  const { colorScheme } = useMantineColorScheme();
  const Logo = colorScheme === "dark" ? LogoWhite : LogoBlack;

  return (
    <Box>
      <Image src={Logo} w={120} key="image" alt="vcollab_logo" />
    </Box>
  );
};
