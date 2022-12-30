import { Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Post } from "../../atoms/postsAtom";
import moment from "moment";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type SinglePostProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  homePage?: boolean;
};

const SinglePost: React.FC<SinglePostProps> = ({
  post
}) => {
  return (
    <Flex direction="column" bg="#222" justifyContent={"center"} align="center">
      <Flex
        border="none"
        color="white"
        mt={"30px"}
        padding={"0px 10px"}
        borderRadius={"4px 4px 0px 0px"}
        _hover={{
          borderColor: "none",
        }}
        width={{base: "98%", sm: "90%"}}
      >
        <Stack spacing={3} p="10px">
          <Text fontSize="16pt">{post.title}</Text>
          <Stack spacing={0.5}>
            <Text marginRight={1} fontSize="10pt" color="gray.300">
              Posted by {post.creatorDisplayName}
            </Text>
            <Text color={"#777"} fontSize={{ base: "8pt", sm: "10pt" }}>
              {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <ReactQuill value={post.body} readOnly={true} theme={"bubble"} />
        </Stack>
      </Flex>
    </Flex>
  );
};
export default SinglePost;
