import { Group } from "@mantine/core";
import {
  IconCheck,
  IconCopy,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import { useState } from "react";

interface ActionsProps {
  msgId: string;
  relevant: boolean | null;
  partsString: string;
  updateRelevancy: (msgId: string, relevant: boolean | null) => void;
}

export const MessageActions = ({
  msgId,
  relevant,
  partsString,
  updateRelevancy,
}: ActionsProps) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(partsString);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  let ThumbUpIcon = IconThumbUp;
  let ThumbDownIcon = IconThumbDown;

  let onThumbUpClick = () => updateRelevancy(msgId, true);
  let onThumbDownClick = () => updateRelevancy(msgId, false);

  if (relevant === true) {
    ThumbUpIcon = IconThumbUpFilled;
    onThumbUpClick = () => updateRelevancy(msgId, null);
  } else if (relevant === false) {
    ThumbDownIcon = IconThumbDownFilled;
    onThumbDownClick = () => updateRelevancy(msgId, null);
  }

  return (
    <Group mt="xs" pl="xs">
      {copied ? (
        <IconCheck size={18} />
      ) : (
        <IconCopy style={{ cursor: "pointer" }} size={18} onClick={onCopy} />
      )}
      <ThumbUpIcon
        style={{ cursor: "pointer" }}
        size={18}
        onClick={onThumbUpClick}
      />
      <ThumbDownIcon
        style={{ cursor: "pointer" }}
        size={18}
        onClick={onThumbDownClick}
      />
    </Group>
  );
};
