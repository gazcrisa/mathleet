import { Flex, Stack, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import React from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";
import Dot from "../Dot";
import LikeButton from "../LikeButton";
import CommentButton from "../CommentButton";
import ReplyItem from "./ReplyItem";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt: Timestamp;
  replies: Reply[];
};

export type Reply = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  parentId: string;
  text: string;
  createdAt: Timestamp;
};

type CommentItemProps = {
  comment: Comment;
  onDeleteComment: (comment: Comment) => void;
  onCreateReply: (replyText: string, parentId: string) => void;
  loadingDelete: boolean;
  userId: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDeleteComment,
  onCreateReply,
  loadingDelete,
  userId,
}) => {
  return (
    <Flex
      borderBottom={"0.5px solid"}
      borderColor={"#444"}
      padding={"12px 0px"}
      direction="column"
      margin="0px !important"
    >
      <Stack spacing={2} p={"0px 20px"} width="100%">
        <Text marginRight={1} fontSize="10pt" color="gray.300">
          Posted by {comment.creatorDisplayText}
        </Text>
        <ReactQuill value={comment.text} readOnly={true} theme={"bubble"} />
        <Stack direction="row" spacing={2} align="center">
          <Text color={"#777"} fontSize={{ base: "10pt" }}>
            {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
          </Text>
          <Dot />
          <LikeButton />
          <Dot />
          <CommentButton onCreateReply={onCreateReply} parentId={comment.id} />
        </Stack>
      </Stack>
      <Stack spacing={0.5}> 
        {comment.replies.map((reply: Reply) => (
          <Flex bg="#111" justifyContent="flex-end" key={reply.id}>
            <ReplyItem reply={reply}/>
          </Flex>
        ))}
      </Stack>
    </Flex>
  );
};
export default CommentItem;
