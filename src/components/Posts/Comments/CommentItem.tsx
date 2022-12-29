import { Box, Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import { TbUserCircle } from "react-icons/tb";
import {BsFileArrowDown, BsFileArrowUp} from "react-icons/bs"
import moment from "moment";
import React from "react";
import {
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
} from "react-icons/io5";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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
    <Flex borderBottom={"1px"} borderColor={"#444"} paddingBottom={"12px"}>
      <Box mr={2}>
        <Icon as={TbUserCircle} fontSize={26} color="rgb(129, 131, 132)" />
      </Box>
      <Stack spacing={4} width={"90%"}>
        <Stack direction="row" align="center" spacing={2} fontSize="8pt">
          <Text
            color="#D7DADC"
            fontSize="12pt"
            fontWeight={600}
            _hover={{ textDecoration: "underline", cursor: "pointer" }}
          >
            {comment.creatorDisplayText}
          </Text>
          {comment.createdAt.seconds && (
            <Text color="rgb(129, 131, 132)" fontSize="11pt">
              {moment(new Date(comment.createdAt.seconds * 1000)).fromNow()}
            </Text>
          )}
          {loadingDelete && <Spinner size="sm" />}
        </Stack>
          <ReactQuill value={comment.text} readOnly={true} theme={"bubble"} />

        <Stack
          direction="row"
          align="center"
          cursor="pointer"
          fontWeight={600}
          color="gray.400"
        >
          <Icon as={BsFileArrowUp} fontSize="14pt" color={"rgb(129, 131, 132)"}/>
          <Icon as={BsFileArrowDown} fontSize="14pt"color={"rgb(129, 131, 132)"}/>
          {userId === comment.creatorId && (
            <>
              <Text
                fontSize="10pt"
                color="rgb(129, 131, 132)"
                _hover={{ color: "blue.500" }}
              >
                Edit
              </Text>
              <Text
                fontSize="10pt"
                color="rgb(129, 131, 132)"
                _hover={{ color: "blue.500" }}
                onClick={() => onDeleteComment(comment)}
              >
                Delete
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};
export default CommentItem;
