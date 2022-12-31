import React, { useState } from "react";
import { Post } from "../../atoms/postsAtom";
import { AiOutlineDelete } from "react-icons/ai";
import { IoBookmark } from "react-icons/io5";
import { RiChat1Fill } from "react-icons/ri";
import { BiLike } from "react-icons/bi";
import {
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userLiked?: boolean;
  onLike: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post
  ) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
  homePage?: boolean;
};

moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1 second ago",
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

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userLiked,
  onLike,
  onDeletePost,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);

      if (!success) {
        throw new Error("Failed to delete post");
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoadingDelete(false);
  };

  return (
    <Flex direction="column" bg="#222">
      <Flex
        border="none"
        color="white"
        padding="0px 10px 20px"
        borderRadius="4px"
        _hover={{
          borderColor: "gray",
          transition: "700ms",
        }}
        cursor="pointer"
        onClick={() => router.push(`/posts/${post.id}`)}
      >
        <Flex direction="column" width="100%">
          {error && (
            <Alert status="error">
              <AlertIcon />
              <Text mr={2}>{error}</Text>
            </Alert>
          )}
          <Stack spacing={3} p="10px">
            <Flex align="center" justifyContent="flex-start" color="#777" paddingTop="8px">
              <Text marginRight={1} fontSize="10pt">
                Posted by {post.creatorDisplayName}
              </Text>
            </Flex>
            <Text fontSize="16pt">{post.title}</Text>
            <ReactQuill value={post.body} readOnly={true} theme={"bubble"} />
          </Stack>
        </Flex>
      </Flex>
      <Flex borderTop="0.5px solid" borderColor="#444" padding="0px 0px 0px 0px">
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
            >
              <Icon
                as={BiLike}
                mr={1}
                fontSize={{ base: "11pt", sm: "15pt" }}
                color={userLiked ? "brand.100" : "rgb(129, 131, 132)"}
                onClick={(event) => onLike(event, post)}
              />
              <Text fontSize={{ base: "10pt", sm: "11pt" }} color="#777">
                {post.likes.length > 0 ? post.likes.length : "Like"}
              </Text>
            </Flex>
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
              cursor="pointer"
            >
              <Icon
                as={RiChat1Fill}
                mr={1}
                fontSize={{ base: "11pt", sm: "15pt" }}
                color="#777"
              />
              <Text fontSize={{ base: "10pt", sm: "11pt" }} color="#777">
                {post.numberOfComments > 0 ? post.numberOfComments : "Comment"}
              </Text>
            </Flex>
            {userIsCreator && (
              <Flex
                align="center"
                p="8px 10px"
                borderRadius={4}
                _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
                cursor="pointer"
                onClick={handleDelete}
              >
                {loadingDelete ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <Icon
                      as={AiOutlineDelete}
                      mr={1}
                      fontSize={{ base: "11pt", sm: "15pt" }}
                      color="#777"
                    />
                    <Text fontSize={{ base: "10pt", sm: "11pt" }} color="#777">
                      Delete
                    </Text>
                  </>
                )}
              </Flex>
            )}
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
        >
          <Icon
            as={IoBookmark}
            mr={1}
            fontSize={{ base: "11pt", sm: "15pt" }}
            color="#777"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
