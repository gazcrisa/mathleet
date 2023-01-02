import {
  Button,
  Flex,
  Icon,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";
import Dot from "../Dot";
import ReplyItem from "./ReplyItem";
import { RiChat1Fill } from "react-icons/ri";
import { BiLike } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { User } from "firebase/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";

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
  userIsCreator: boolean;
  comment: Comment;
  onLikeComment: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    comment: Comment
  ) => void;
  onCreateReply: (replyText: string, parentId: string) => Promise<boolean>;
  onLikeReply: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    reply: Reply
  ) => void;
  onDeleteReply: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, reply: Reply) => Promise<boolean>;
  onDeleteComment: (comment: Comment) => Promise<boolean>;
  userLiked?: boolean;
  userId?: string | null;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  userLiked,
  onLikeComment,
  onCreateReply,
  onLikeReply,
  onDeleteComment,
  onDeleteReply,
  user,
  userIsCreator,
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [loadingCommentDelete, setLoadingCommentDelete] = useState(false);
  const [errorCommentDelete, setErrorCommentDelete] = useState("");
  const [loadingCreateReply, setloadingCreateReply] = useState(false);
  const [errorCreateReply, setErrorCreateReply] = useState("");
  const [replyText, setReplyText] = useState("");

  const setAuthModalState = useSetRecoilState(authModalState);

  const handleCommentReply = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setloadingCreateReply(true);

    try {
      const success = await onCreateReply(replyText, comment.id);
      console.log("was successful?", success);

      if (!success) {
        throw new Error("Failed to create reply");
      }

      setShowEditor(false);
      setReplyText("");

      console.log("Reply was successfully created");
    } catch (error: any) {
      setErrorCreateReply(error.message);
    }

    setloadingCreateReply(false);
  };

  const handleCommentDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingCommentDelete(true);
    try {
      const success = await onDeleteComment(comment);
      console.log("Was delete successful?", success);

      if (!success) {
        throw new Error("Failed to delete post");
      }

      console.log("Comment was successfully deleted");
    } catch (error: any) {
      setErrorCommentDelete(error.message);
    }
    setLoadingCommentDelete(false);
  };

  const showAuthModal = () => {
    setAuthModalState({ open: true, view: "login" });
    setShowEditor(false);
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
              fontSize={{ base: "12pt" }}
              color={userLiked ? "brand.100" : "rgb(129, 131, 132)"}
            />
            <Text fontSize={{ base: "10pt" }} color="#777">
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
          {userIsCreator && (
            <>
              <Dot />
              <Flex
                align="center"
                p="8px 10px"
                borderRadius={4}
                _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
                cursor="pointer"
                onClick={handleCommentDelete}
              >
                {loadingCommentDelete ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <Icon
                      as={AiOutlineDelete}
                      mr={1}
                      fontSize={{ base: "8pt", sm: "10pt" }}
                      color="#777"
                    />
                    <Text fontSize={{ base: "10pt" }} color="#777">
                      Delete
                    </Text>
                  </>
                )}
              </Flex>
            </>
          )}
        </Stack>
      </Stack>
      <>
        {!user && showEditor && showAuthModal()}
        {user && showEditor && (
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
                onClick={handleCommentReply}
                isLoading={loadingCreateReply}
              >
                Reply
              </Button>
            </Flex>
          </Flex>
        )}
      </>
      <Stack spacing={0.5}>
        {comment.replies.map((reply: Reply) => (
          <Flex bg="#161616" justifyContent="flex-end" key={reply.id}>
            <ReplyItem
              reply={reply}
              onLikeReply={onLikeReply}
              onDeleteReply={onDeleteReply}
              userLiked={reply.likes.includes(user?.uid!)}
              userIsCreator={user?.uid === reply.creatorId}
            />
          </Flex>
        ))}
      </Stack>
    </Flex>
  );
};
export default CommentItem;
