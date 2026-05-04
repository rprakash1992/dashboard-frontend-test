import { ScrollArea } from "@mantine/core";
import classes from "./styles.module.css";
import { useStore } from "../../store";
import { AlertMsg } from "./AlertMsg";

export const DialogBox = () => {
  const dialogBoxMsgList = useStore((state) => state.dialogBoxMsgList);
  const removeDialogBoxMsg = useStore((state) => state.removeDialogBoxMsg);

  return (
    <div
      className={classes.dialogBoxContainer}
      style={{
        display: dialogBoxMsgList?.length > 0 ? "block" : "none",
      }}
    >
      <ScrollArea type="never">
        {dialogBoxMsgList?.map((dialogBoxMsg) => (
          <AlertMsg
            key={dialogBoxMsg.id}
            alertMsgText={dialogBoxMsg.msgText}
            alertMsgType={dialogBoxMsg.msgType}
            alertMsgDuration={dialogBoxMsg.msgDuration}
            onClose={() => removeDialogBoxMsg(dialogBoxMsg.id as string)}
          />
        ))}
      </ScrollArea>
    </div>
  );
};
