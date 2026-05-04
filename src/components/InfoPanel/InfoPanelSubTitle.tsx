import { Box, Text, Tooltip } from "@mantine/core";

type InfoPanelSubTitleProps = {
  subTitle?: string;
};

export const InfoPanelSubTitle = ({ subTitle }: InfoPanelSubTitleProps) => {
  return (
    <Box style={{ width: "40%" }}>
      <Tooltip label={subTitle}>
        <Text
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "14px",
            textTransform: "capitalize",
            textAlign: "center"
          }}
        >
          {subTitle || ""}
        </Text>
      </Tooltip>
    </Box>
  );
};
