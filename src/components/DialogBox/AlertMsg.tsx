import { useEffect } from "react";
import { Box, Card, Text } from "@mantine/core";
import { VCCloseIcon } from "../../assets/icons";
import { type AlertMsgEnum } from "../../store/actionSlice";

const alertColors: any = {
  success: "#82DD55",
  error: "#E23636",
  warning: "#EDB95E",
  info: "#3f8be4",
};

type AlertMsgProps = {
  alertMsgText: string;
  alertMsgType: AlertMsgEnum;
  alertMsgDuration?: number;
  onClose: () => void;
};

export const AlertMsg = ({
  alertMsgText,
  alertMsgType,
  alertMsgDuration,
  onClose,
}: AlertMsgProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, alertMsgDuration ?? 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Card
      style={{
        borderRadius: "2px",
        boxShadow: "0 0 10px #0000006b",
        display: "flex",
        flexDirection: "row",
        padding: 0,
        marginBottom: "10px",
      }}
    >
      <Box
        style={{
          width: "5px",
          backgroundColor: alertColors[alertMsgType],
        }}
      />
      <Box style={{ display: "flex", flex: 1, padding: "10px" }}>
        <Text size="sm" fw={400}>
          {alertMsgText}
        </Text>
      </Box>
      <Box style={{ width: "30px", paddingTop: "5px" }}>
        <VCCloseIcon
          style={{
            cursor: "pointer",
          }}
          size={22}
          onClick={onClose}
        />
      </Box>
    </Card>
  );
};
