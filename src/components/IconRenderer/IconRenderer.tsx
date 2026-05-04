import { ActionIcon, Loader, Tooltip } from "@mantine/core";

type IconRendererProps = {
  icon: any;
  isdisabled?: boolean;
  tooltipLabel?: string;
  stroke?: number;
  size?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  style?: any;
  isLoading?: boolean;
  onClick?: (e: any) => void;
};

export const IconRenderer = ({
  icon: Icon,
  isdisabled,
  tooltipLabel,
  stroke,
  size,
  tooltipPosition,
  style,
  isLoading,
  onClick,
}: IconRendererProps) =>
  tooltipLabel ? (
    <Tooltip label={tooltipLabel} position={tooltipPosition ?? "top"}>
      <ActionIcon
        onClick={isdisabled ? undefined : onClick}
        variant="subtle"
        color="gray"
        disabled={isdisabled}
        size={size ?? "md"}
        style={style}
      >
        {isLoading ? (
          <Loader size={12} />
        ) : (
          <Icon
            style={{ width: "70%", height: "70%" }}
            stroke={stroke ?? 1.5}
          />
        )}
      </ActionIcon>
    </Tooltip>
  ) : (
    <ActionIcon
      onClick={isdisabled ? undefined : onClick}
      variant="subtle"
      color="gray"
      disabled={isdisabled}
      size={size ?? "md"}
      style={style}
    >
      {isLoading ? (
        <Loader size={12} />
      ) : (
        <Icon style={{ width: "70%", height: "70%" }} stroke={stroke ?? 1.5} />
      )}
    </ActionIcon>
  );
