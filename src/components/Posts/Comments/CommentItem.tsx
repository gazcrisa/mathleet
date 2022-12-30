import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import { BsDot } from "react-icons/bs";
import moment from "moment";
import React from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";
import { BiLike } from "react-icons/bi";
import { RiChat1Fill } from "react-icons/ri";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

moment.locale("en", {
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
    <Flex borderBottom={"1px"} borderColor={"#444"} paddingBottom={"12px"}>
      <Stack spacing={2} p={"0px 20px"} width="100%">
        <Text marginRight={1} fontSize="10pt" color="gray.300">
          Posted by {comment.creatorDisplayText}
        </Text>
        <ReactQuill value={comment.text} readOnly={true} theme={"bubble"} />
        <Stack direction="row" spacing={2} align="center">
          <Text color={"#777"} fontSize={{ base: "10pt" }}>
            {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
          </Text>
          <Icon
            as={BsDot}
            fontSize={{ base: "8pt" }}
            color={false ? "brand.100" : "rgb(129, 131, 132)"}
            onClick={() => {}}
          />
          <Flex
            align="center"
            p="8px 8px"
            borderRadius={4}
            _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
            cursor="pointer"
          >
            <Icon
              as={BiLike}
              mr={1}
              fontSize={{ base: "8pt", sm: "10pt" }}
              color={false ? "brand.100" : "rgb(129, 131, 132)"}
              onClick={() => {}}
            />
            <Text fontSize={{ base: "10pt" }} color="#777">
              {false ? 12 : "Like"}
            </Text>
          </Flex>
          <Icon
            as={BsDot}
            fontSize={{ base: "8pt" }}
            color={false ? "brand.100" : "rgb(129, 131, 132)"}
            onClick={() => {}}
          />
          <Flex
            align="center"
            p="8px 8px"
            borderRadius={4}
            _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
            cursor="pointer"
          >
            <Icon
              as={RiChat1Fill}
              mr={1}
              fontSize={{ base: "8pt", sm: "10pt" }}
              color={false ? "brand.100" : "rgb(129, 131, 132)"}
              onClick={() => {}}
            />
            <Text fontSize={{ base: "10pt" }} color="#777">
              {false ? 12 : "Reply"}
            </Text>
          </Flex>
        </Stack>
      </Stack>
    </Flex>
  );
};
export default CommentItem;
