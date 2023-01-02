import { Button, Flex, Icon, Stack, Text, Textarea } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";
import Dot from "../Dot";
import ReplyItem from "./ReplyItem";
import { RiChat1Fill } from "react-icons/ri";
import { BiLike } from "react-icons/bi";
import { User } from "firebase/auth";

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
  likes: string[];
};

export type Reply = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  parentId: string;
  text: string;
  createdAt: Timestamp;
  likes: string[];
};

type CommentItemProps = {
  user?: User | null;
  comment: Comment;
  onLikeComment: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    comment: Comment
  ) => void;
  onCreateReply: (replyText: string, parentId: string) => void;
  onLikeReply: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    reply: Reply
  ) => void;
  onDeleteComment: (comment: Comment) => void;
  userLiked?: boolean;
  loadingDelete: boolean;
  userId?: string | null;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  userLiked,
  onLikeComment,
  onCreateReply,
  onLikeReply,
  onDeleteComment,
  loadingDelete,
  userId,
  user,
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    onCreateReply(replyText, comment.id);
    setShowEditor(false);
    setReplyText("");
  };

  return (
    <Flex
      borderBottom={"0.5px solid"}
      borderColor={"#444"}
      padding={"14px 0px 0px 0px"}
      direction="column"
      margin="0px !important"
    >
      <Stack spacing={3} p={"0px 20px"} width="100%">
        <Text marginRight={1} fontSize="10pt" color="gray.300">
          Posted by {comment.creatorDisplayText}
        </Text>
        <ReactQuill value={comment.text} readOnly={true} theme={"bubble"} />
        <Stack direction="row" spacing={2} align="center">
          <Text color={"#777"} fontSize={{ base: "10pt" }}>
            {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
          </Text>
          <Dot />
          <Flex
            align="center"
            p="8px 0px"
            borderRadius={4}
            _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
            cursor="pointer"
            onClick={(event) => {
              onLikeComment(event, comment);
            }}
          >
            <Icon
              as={BiLike}
              mr={1}
              fontSize={{ base: "8pt", sm: "10pt" }}
              color={userLiked ? "brand.100" : "rgb(129, 131, 132)"}
            />
            <Text fontSize={{ base: "10pt", sm: "11pt" }} color="#777">
              {comment.likes.length > 0 ? comment.likes.length : "Like"}
            </Text>
          </Flex>
          <Dot />
          <Flex
            align="center"
            p="8px 0px"
            borderRadius={4}
            _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
            cursor="pointer"
            onClick={() => {
              setShowEditor(!showEditor);
            }}
          >
            <Icon
              as={RiChat1Fill}
              mr={1}
              fontSize={{ base: "8pt", sm: "10pt" }}
              color={false ? "brand.100" : "rgb(129, 131, 132)"}
            />
            <Text fontSize={{ base: "10pt" }} color="#777">
              {false ? 12 : "Reply"}
            </Text>
          </Flex>
        </Stack>
      </Stack>
      {showEditor && (
        <Flex direction="column" padding="10px" align="center">
          <Flex justifyContent="center" width="90%">
            <Textarea
              name="reply"
              color="#cbd5e0"
              border="1px solid"
              borderColor="#444"
              value={replyText}
              fontSize={{ base: "10pt", sm: "12pt" }}
              onChange={(e) => {
                setReplyText(e.target.value);
              }}
              placeholder={"Reply to this comment"}
              _hover={{ border: "1px", borderColor: "#444" }}
            />
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="flex-end"
            width="90%"
            mt="6px"
          >
            <Button
              variant="outline"
              height="34px"
              fontSize={{ base: "10pt", sm: "12pt" }}
              onClick={(e) => {
                setShowEditor(false);
                setReplyText("");
              }}
              mr="6px"
            >
              Cancel
            </Button>
            <Button
              height="34px"
              fontSize={{ base: "10pt", sm: "12pt" }}
              padding={{ base: 3, sm: 4 }}
              disabled={!replyText.length}
              onClick={handleReply}
            >
              Reply
            </Button>
          </Flex>
        </Flex>
      )}
      <Stack spacing={0.5}>
        {comment.replies.map((reply: Reply) => (
          <Flex bg="#161616" justifyContent="flex-end" key={reply.id}>
            <ReplyItem
              reply={reply}
              onLikeReply={onLikeReply}
              userLiked={reply.likes.includes(user?.uid!)}
            />
          </Flex>
        ))}
      </Stack>
    </Flex>
  );
};
export default CommentItem;
