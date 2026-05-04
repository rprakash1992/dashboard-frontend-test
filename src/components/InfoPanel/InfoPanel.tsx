import { Box, useMantineColorScheme } from "@mantine/core";
import { useHover } from "@mantine/hooks";

import { InfoPanelBtnSection } from "./InfoPanelBtnSection";
import { InfoPanelTitle } from "./InfoPanelTitle";
import { InfoPanelSubTitle } from "./InfoPanelSubTitle";

type InfoPanelProps = {
  keyName: string;
  title: string;
  secondTitle?: string;
  subTitle?: string;
  picture?: string;
  isChecked?: boolean;
  showCrossIcon?: boolean;
  showCheckIcon?: boolean;
  onClick?: (e?: any) => void;
  onCrossIconClick?: (e: any) => void;
  onCheckIconClick?: (e: any) => void;
};

export const InfoPanel = ({
  keyName,
  title,
  subTitle,
  secondTitle,
  picture,
  isChecked,
  showCrossIcon,
  showCheckIcon,
  onClick,
  onCrossIconClick,
  onCheckIconClick,
}: InfoPanelProps) => {
  const { hovered, ref } = useHover();
  const theme = useMantineColorScheme();
  const hoverColor = theme.colorScheme === "dark" ? "#373A40" : "#e9ecef";

  return (
    <Box
      p="xs"
      // direction="row"
      // align="center"
      // justify="space-between"
      ref={ref}
      key={keyName}
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        backgroundColor: hovered ? hoverColor : "",
      }}
    >
      <InfoPanelTitle
        picture={picture}
        title={title}
        secondTitle={secondTitle}
      />
      <InfoPanelSubTitle subTitle={subTitle} />
      <InfoPanelBtnSection
        showCrossIcon={showCrossIcon}
        showCheckIcon={showCheckIcon}
        isChecked={isChecked}
        onCrossIconClick={(e: any) => onCrossIconClick && onCrossIconClick(e)}
        onCheckIconClick={(e: any) => onCheckIconClick && onCheckIconClick(e)}
      />
    </Box>
  );
};
