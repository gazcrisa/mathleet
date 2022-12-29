import React, { useState } from "react";
import { Post } from "../../atoms/postsAtom";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat } from "react-icons/bs";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { IoBookmark } from "react-icons/io5";
import { RiChat1Fill } from "react-icons/ri";
import { BiLike } from "react-icons/bi";
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

moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "seconds",
    ss: "%ss",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
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
    <Flex direction="column" bg="#222" borderBottom="1px" borderColor="#444">
      <Flex
        border="none"
        color="white"
        padding={"0px 10px 20px"}
        borderRadius={singlePostPage ? "4px 4px 0px 0px" : "4px"}
        _hover={{
          borderColor: singlePostPage ? "none" : "gray",
          transition: "700ms",
        }}
        cursor={singlePostPage ? "unset" : "pointer"}
        onClick={() => onSelectPost && onSelectPost(post)}
      >
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
                <Text marginRight={1} fontSize="10pt">
                  Posted by {post.creatorDisplayName}
                </Text>
              </Flex>
            </Stack>
            <Text fontSize="16pt">{post.title}</Text>
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
        </Flex>
      </Flex>
      <Flex borderTop="1px solid" borderColor="#444" padding="0px 0px 0px 0px">
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
                color={userVoteValue === 1 ? "brand.100" : "rgb(129, 131, 132)"}
                onClick={(event) => onVote(event, post, 1, post.id)}
              />
              <Text fontSize={{ base: "10pt", sm: "11pt" }} color="#777">
                {post.numberOfComments > 0 ? post.voteStatus : "Like"}
              </Text>
            </Flex>
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
              cursor="pointer"
            >
              <Icon as={RiChat1Fill} mr={1} fontSize={{ base: "11pt", sm: "15pt" }} color="#777" />
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
          <Text color={"#777"} fontSize={{ base: "10pt", sm: "11pt" }}>
            {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
          </Text>
        </Flex>
        <Flex
          align="center"
          p="8px 10px"
          borderLeft="1px solid"
          borderColor="#444"
          _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
          cursor="pointer"
        >
          <Icon as={IoBookmark} mr={1} fontSize={{ base: "11pt", sm: "15pt" }} color="#777" />
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
