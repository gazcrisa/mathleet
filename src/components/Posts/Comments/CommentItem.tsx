import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import { BsDot } from "react-icons/bs";
import moment from "moment";
import React from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";
import { BiLike } from "react-icons/bi";
import { RiChat1Fill } from "react-icons/ri";
import Dot from "../Dot";
import LikeButton from "../LikeButton";
import CommentButton from "../CommentButton";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1s",
    ss: "%ss",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "Yesterday",
    dd: "%dd",
    M: "a month",
    MM: "%dM",
    y: "1y",
    yy: "%dY",
  },
});

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt: Timestamp;
};

type CommentItemProps = {
  comment: Comment;
  onDeleteComment: (comment: Comment) => void;
  loadingDelete: boolean;
  userId: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDeleteComment,
  loadingDelete,
  userId,
}) => {
  return (
    <Flex borderBottom={"0.5px solid"} borderColor={"#444"} padding={"12px 0px"}>
      <Stack spacing={2} p={"0px 20px"} width="100%">
        <Text marginRight={1} fontSize="10pt" color="gray.300">
          Posted by {comment.creatorDisplayText}
        </Text>
        <ReactQuill value={comment.text} readOnly={true} theme={"bubble"} />
        <Stack direction="row" spacing={2} align="center">
          <Text color={"#777"} fontSize={{ base: "10pt" }}>
            {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
          </Text>
          <Dot/>
          <LikeButton/>
          <Dot/>
          <CommentButton/>
        </Stack>
      </Stack>
    </Flex>
  );
};
export default CommentItem;
