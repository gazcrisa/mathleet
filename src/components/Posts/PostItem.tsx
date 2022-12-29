import React, { useState } from "react";
import { Post } from "../../atoms/postsAtom";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat } from "react-icons/bs";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { IoBookmarkOutline } from "react-icons/io5";
import {
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Image,
  Skeleton,
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
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
  homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVoteValue,
  onVote,
  onDeletePost,
  onSelectPost,
  homePage,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const router = useRouter();
  const singlePostPage = !onSelectPost;

  const [error, setError] = useState(false);

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

      if (singlePostPage) {
        router.push(`/`);
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoadingDelete(false);
  };

  return (
    <Flex
      border="none"
      bg="#222"
      color="white"
      borderRadius={singlePostPage ? "4px 4px 0px 0px" : "4px"}
      _hover={{
        borderColor: singlePostPage ? "none" : "gray",
        transition: "700ms",
      }}
      cursor={singlePostPage ? "unset" : "pointer"}
      onClick={() => onSelectPost && onSelectPost(post)}
    >
      <Flex
        direction="column"
        align="center"
        bg="#222"
        borderRight="1px solid #444"
        p={2}
        width="40px"
        borderRadius={singlePostPage ? "0" : "3px 0px 0px 3px"}
      >
        <Icon
          as={BiUpvote}
          color={userVoteValue === 1 ? "brand.100" : "rgb(129, 131, 132)"}
          fontSize={26}
          onClick={(event) => onVote(event, post, 1, post.id)}
          cursor="pointer"
        />
        <Text fontSize="14pt">{post.voteStatus}</Text>
        <Icon
          as={BiDownvote}
          color={userVoteValue === -1 ? "#9B2C2C" : "rgb(129, 131, 132)"}
          fontSize={26}
          onClick={(event) => onVote(event, post, -1, post.id)}
          cursor="pointer"
        />
      </Flex>
      <Flex direction="column" width="100%">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text mr={2}>{error}</Text>
          </Alert>
        )}
        <Stack spacing={3} p="10px">
          <Stack
            direction="row"
            spacing={0.6}
            align="center"
            fontSize="12pt"
            color="#777"
          >
            <Flex align="center" justifyContent="center">
              <Text marginRight={1}>Posted by {post.creatorDisplayName}</Text>
              <Text color={"rgb(129, 131, 132)"} fontSize="11pt">
                {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
              </Text>
            </Flex>
          </Stack>
          <Text fontSize="16pt" fontWeight={600}>
            {post.title}
          </Text>
          <ReactQuill value={post.body} readOnly={true} theme={"bubble"} />
          {post.imageURL && (
            <Flex justify="center" align="center" p={2}>
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                src={post.imageURL}
                maxHeight="460px"
                alt="Post Image"
                display={loadingImage ? "none" : "unset"}
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500">
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={1} fontSize="16pt" color="#777" />
            <Text fontSize="11pt" fontWeight="700" color="#777">
              {post.numberOfComments}
            </Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={1} fontSize="16pt" color="#777" />
            <Text fontSize="11pt" fontWeight="700" color="#777">
              Save
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
                  <Icon as={AiOutlineDelete} mr={1} fontSize="16pt" color="#777" />
                  <Text fontSize="11pt" fontWeight="700" color="#777">
                    Delete
                  </Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
