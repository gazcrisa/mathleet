import { Flex, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import CommentButton from "../CommentButton";
import dynamic from "next/dynamic";

import Dot from "../Dot";
import LikeButton from "../LikeButton";
import { Reply } from "./CommentItem";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type ReplyItemProps = {
  reply: Reply;
};

const ReplyItem: React.FC<ReplyItemProps> = ({ reply }) => {

  return (
    
    <Flex
      padding={"12px 0px"}
      width="95%"
      mt="10px"
    >
        <Stack spacing={2} p={"0px 20px"} width="100%">
        <Text marginRight={1} fontSize="10pt" color="gray.400">
          Posted by {reply.creatorDisplayText}
        </Text>
        <ReactQuill value={reply.text} readOnly={true} theme={"bubble"} />
        <Stack direction="row" spacing={2} align="center">
          <Text color={"#777"} fontSize={{ base: "10pt" }}>
            {moment(new Date(reply.createdAt.seconds * 1000)).fromNow()}
          </Text>
          <Dot />
          <LikeButton />
        </Stack>
      </Stack>
    </Flex>
  );
};
export default ReplyItem;
