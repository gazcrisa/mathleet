import { Button, Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";
import Dot from "../Dot";
import { BiLike } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { User } from "firebase/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { Comment } from "../../../types";
import { useRouter } from "next/router";
import { ANONYMOUS } from "../../../constants";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type CommentItemProps = {
  user?: User | null;
  userIsCreator: boolean;
  comment: Comment;
  onLikeComment: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    comment: Comment
  ) => void;
  onDeleteComment: (comment: Comment) => Promise<boolean>;
  userLiked?: boolean;
  userId?: string | null;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  userLiked,
  onLikeComment,
  onDeleteComment,
  user,
  userIsCreator,
}) => {
  const [loadingCommentDelete, setLoadingCommentDelete] = useState(false);
  const [errorCommentDelete, setErrorCommentDelete] = useState("");
  const router = useRouter();

  const handleCommentDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingCommentDelete(true);
    try {
      const success = await onDeleteComment(comment);

      if (!success) {
        throw new Error("Failed to delete post");
      }
    } catch (error: any) {
      setErrorCommentDelete(error.message);
    }
    setLoadingCommentDelete(false);
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
        <Flex>
          <Button
            marginRight={1}
            fontSize="10pt"
            fontWeight={500}
            variant="link"
            color="brand.100"
            cursor="pointer"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/user/${comment.creatorId}`);
            }}
          >
            {comment.creatorDisplayText
              ? comment.creatorDisplayText
              : ANONYMOUS}
          </Button>
        </Flex>
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
          {userIsCreator && (
            <>
              <Dot />
              <Flex
                align="center"
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
                      fontSize={{ base: "12pt" }}
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
    </Flex>
  );
};
export default CommentItem;
