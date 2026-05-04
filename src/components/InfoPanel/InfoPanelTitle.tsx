import { Avatar, Box, Center, Text, Tooltip } from "@mantine/core";

type InfoPanelTitleProps = {
  picture?: string;
  title: string;
  secondTitle?: string;
};

export const InfoPanelTitle = ({
  picture,
  title,
  secondTitle,
}: InfoPanelTitleProps) => {
  return (
    <Box style={{ width: "50%" }}>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
          width: "100%",
        }}
      >
        <Center w="20%" maw="33px">
          <Avatar src={picture} size={30} radius="lg" />
        </Center>
        <Box style={{ width: "80%" }}>
          <Tooltip label={title}>
            <Text
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginLeft: "10px",
                fontSize: "14px",
                textTransform: "capitalize",
              }}
            >
              {title}
            </Text>
          </Tooltip>
          {secondTitle && (
            <Tooltip label={secondTitle}>
              <Text
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginLeft: "10px",
                  fontSize: "10px",
                  textTransform: "capitalize",
                }}
              >
                ({secondTitle})
              </Text>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
};
