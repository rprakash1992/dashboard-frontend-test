import { Flex, Text } from "@mantine/core";
import { VCLogoutIcon } from "../../assets/icons";

export const ProfileImageTop = ({
  handleLogout,
}: {
  handleLogout: () => void;
}) => {
  return (
    <Flex
      gap="xs"
      justify="space-between"
      align="center"
      direction="row"
      wrap="wrap"
      w="100%"
    >
      <Text
        fw={"bold"}
        styles={{ root: { fontSize: "1.2rem", lineHeight: "2" } }}
      >
        Profile Picture
      </Text>
      <Flex
        direction="row"
        justify="center"
        align="center"
        style={{
          cursor: "pointer",
        }}
        onClick={handleLogout}
      >
        <Text c="#74c0fc" mr="5px" onClick={handleLogout}>
          Logout
        </Text>
        <VCLogoutIcon color="#74c0fc" size={20} />
      </Flex>
    </Flex>
  );
};
