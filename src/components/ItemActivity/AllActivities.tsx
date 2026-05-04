import React, { useState, useRef, useEffect } from "react";
import { Stack } from "@mantine/core";

import { ActivityCard } from "./ActivityCard";
import { ActivityCardForComment } from "./ActivityCardForComment";
import { ActivityCardForStartComment } from "./ActivityCardForStartComment";
import { CommentBox } from "./CommentBox";
import { useStore } from "../../store";
import classes from "./AllActivites.module.css";
import type { ActivityType } from "./ItemActivity";

interface AllActivitiesProps {
  activities: ActivityType[];
  profileDetails: any[];
  onAddCommentClick: (id: string, contentType: string) => void;
  onCancelAddCommentClick: (id: string) => void;
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    comment: string,
    contentType: string
  ) => void;
}

export const AllActivities = ({
  activities,
  profileDetails,
  onAddCommentClick,
  onCancelAddCommentClick,
  handleKeyDown,
}: AllActivitiesProps) => {
  const showCommentBox = useStore((state) => state.showCommentBox);
  const [highlightActivity, setHighlightActivity] = useState<string>("");
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activities && activities.length > 0 && showCommentBox) {
      viewport?.current?.scrollTo({
        top: viewport?.current?.scrollHeight,
        behavior: "auto",
      });
    }
  }, [showCommentBox, activities]);

  const scrollToId = (id: any, activityRef?: HTMLDivElement) => {
    console.log({activityRef})
    setHighlightActivity(id);
    // const el = document.getElementById(id);

    viewport?.current?.scrollTo({ top: 100, behavior: "smooth" });

    setTimeout(() => {
      setHighlightActivity("");
    }, 5000);
  };

  return (
    <Stack p="10px" gap="xs">
      {activities.map((ele: ActivityType) => (
        <React.Fragment key={ele?.id}>
          {(ele?.activity_type === "activity" ||
            ele?.activity_type === "freshComment") && (
            <ActivityCard
              ele={ele}
              profileDetails={profileDetails}
              onAddCommentClick={onAddCommentClick}
              highlightActivity={highlightActivity}
              fadeIn={classes.activitesFadeIn}
              fadeOut={classes.activitesFadeOut}
              activityType={ele?.activity_type}
            />
          )}
          {(ele?.activity_type === "comment" ||
            ele?.activity_type === "reply") && (
            <ActivityCardForComment
              ele={ele}
              profileDetails={profileDetails}
              onAddCommentClick={onAddCommentClick}
              prevActivity={activities.find((d) => d.id === ele?.prev_action)}
              scrollToId={scrollToId}
              highlightActivity={highlightActivity}
              fadeIn={classes.activitesFadeIn}
              fadeOut={classes.activitesFadeOut}
            />
          )}
          {(ele?.activity_type === "startComment" ||
            ele?.activity_type === "startReply") && (
            <ActivityCardForStartComment
              ele={ele}
              profileDetails={profileDetails}
              handleKeyDown={handleKeyDown}
              onCancelAddCommentClick={onCancelAddCommentClick}
            />
          )}
        </React.Fragment>
      ))}
      {showCommentBox && <CommentBox handleKeyDown={handleKeyDown} />}
    </Stack>
  );
};
