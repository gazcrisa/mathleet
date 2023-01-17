import React from "react";
import { IoBookmark } from "react-icons/io5";
import { RiChat1Fill } from "react-icons/ri";
import { BiLike } from "react-icons/bi";
import { Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { Post } from "../../types";
import moment from "moment";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";
import { useRecoilState } from "recoil";
import { userState } from "../../atoms/userAtom";
import { SavedPost } from "../../types/user";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userLiked?: boolean;
  userSaved?: boolean;
  onLike: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    post: Post
  ) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost: (post: Post) => void;
  onSavePost: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    post: Post
  ) => void;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userLiked,
  onLike,
  onSelectPost,
  onSavePost,
}) => {

  const [userStateValue, setUserStateValue] = useRecoilState(userState);

  const isSaved = (userStateValue.savedPosts?.filter((p: SavedPost) => p.id === post.id))?.length
  
  return (
    <Flex direction="column" bg="#1c1c1c">
      <Flex
        border="none"
        color="#cccccc"
        padding="0px 10px 20px"
        borderRadius="4px"
        _hover={{
          borderColor: "gray",
          transition: "700ms",
        }}
        cursor="pointer"
        onClick={() => onSelectPost(post)}
      >
        <Flex direction="column" width="100%">
          <Stack spacing={3} p="10px">
            <Flex
              align="center"
              justifyContent="flex-start"
              color="#777"
              paddingTop="8px"
            >
              <Text marginRight={1} fontSize="10pt">
                Posted by 
              </Text>
              <Text fontSize="10pt" color="brand.100">{post.creatorDisplayName}</Text>
            </Flex>
            <Text fontSize="16pt">{post.title}</Text>
            <Flex className="post-item-container" maxHeight={"250px"}>
              <ReactQuill value={post.body} readOnly={true} theme={"bubble"} />
            </Flex>
          </Stack>
        </Flex>
      </Flex>
      <Flex
        borderTop="0.5px solid"
        borderColor="#444"
        padding="0px 0px 0px 0px"
      >
        <Flex
          align="center"
          justifyContent="space-between"
          padding={"0px 10px"}
          width="100%"
        >
          <Stack direction="row">
            <Flex
              align="center"
              p="8px 8px"
              borderRadius={4}
              _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
              cursor="pointer"
              onClick={(event) => onLike(event, post)}
            >
              <Icon
                as={BiLike}
                mr={1}
                fontSize={{ base: "11pt", sm: "15pt" }}
                color={userLiked ? "brand.100" : "rgb(129, 131, 132)"}
              />
              <Text fontSize={{ base: "10pt", sm: "11pt" }} color="#777">
                {post.likes.length > 0 ? post.likes.length : "Like"}
              </Text>
            </Flex>
            <Flex align="center" p="8px 10px" borderRadius={4}>
              <Icon
                as={RiChat1Fill}
                mr={1}
                fontSize={{ base: "11pt", sm: "15pt" }}
                color="#777"
              />
              <Text fontSize={{ base: "10pt", sm: "11pt" }} color="#777">
                {post.numComments}
              </Text>
            </Flex>
          </Stack>
          <Text color={"#777"} fontSize={{ base: "8pt", sm: "10pt" }}>
            {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
          </Text>
        </Flex>
        <Flex
          align="center"
          p="8px 10px"
          borderLeft="0.5px solid"
          borderColor="#444"
          _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
          cursor="pointer"
          onClick={(event) => onSavePost(event, post)}
        >
          <Icon
            as={IoBookmark}
            mr={1}
            fontSize={{ base: "11pt", sm: "15pt" }}
            color={isSaved ? "#e53935" : "rgb(129, 131, 132)"}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
