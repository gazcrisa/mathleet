import { Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import Dot from "../Dot";
import { Reply } from "./CommentItem";
import { BiLike } from "react-icons/bi";
import { User } from "firebase/auth";
import { AiOutlineDelete } from "react-icons/ai";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type ReplyItemProps = {
  reply: Reply;
  onLikeReply: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    reply: Reply
  ) => void;
  onDeleteReply: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, reply: Reply) => Promise<boolean>;
  userLiked: boolean;
  userIsCreator: boolean;
};

const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
  onLikeReply,
  userLiked,
  onDeleteReply,
  userIsCreator
}) => {

  const [loadingDeleteReply, setloadingDeleteReply] = useState(false);
  const [errorDeleteReply, setErrorDeleteReply] = useState("");

  const handleReplyDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    setloadingDeleteReply(true);
    try {
      const success = await onDeleteReply(event, reply);
      console.log("Was delete successful?", success);

      if (!success) {
        throw new Error("Failed to delete post");
      }

      console.log("Comment was successfully deleted");
    } catch (error: any) {
      setErrorDeleteReply(error.message);
    }
    setloadingDeleteReply(false);
  };

  return (
    <Flex padding={"12px 0px"} width="95%" mt="10px">
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
          <Flex
            align="center"
            p="8px 0px"
            borderRadius={4}
            _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
            cursor="pointer"
            onClick={(event) => {
              onLikeReply(event, reply);
            }}
          >
            <Icon
              as={BiLike}
              mr={1}
              fontSize={{ base: "12pt" }}
              color={userLiked ? "brand.100" : "rgb(129, 131, 132)"}
            />
            <Text fontSize={{ base: "10pt", sm: "11pt" }} color="#777">
              {reply.likes.length > 0 ? reply.likes.length : "Like"}
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
                onClick={handleReplyDelete}
              >
                {loadingDeleteReply ? (
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
    </Flex>
  );
};
export default ReplyItem;
