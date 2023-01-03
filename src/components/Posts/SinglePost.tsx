import { Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Post } from "../../atoms/postsAtom";
import moment from "moment";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.bubble.css";
import { AiOutlineDelete } from "react-icons/ai";
import { BiLike } from "react-icons/bi";
import { RiChat1Fill } from "react-icons/ri";
import { useRouter } from "next/router";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type SinglePostProps = {
  post: Post;
  userIsCreator: boolean;
  userLiked: boolean;
  onDeletePost: (post: Post) => Promise<boolean>;
  onLike: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    post: Post
  ) => void;
};

const SinglePost: React.FC<SinglePostProps> = ({
  post,
  userLiked,
  onLike,
  userIsCreator,
  onDeletePost
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

      router.push(`/`);
    } catch (error: any) {
      setError(error.message);
    }
    setLoadingDelete(false);
  };

  useEffect(() => {
    console.log("inside use effect, post was", post)
  }, [post])

  return (
    <Flex direction="column" bg="#1c1c1c" justifyContent={"center"} align="center">
      <Flex
        border="none"
        color="#cccccc"
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
          <Stack direction="row">
            <Flex
              align="center"
              borderRadius={4}
              _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
              cursor="pointer"
              onClick={(event) => onLike(event, post)}
            >
              <Icon
                as={BiLike}
                mr={1}
                fontSize={{ base: "12pt", sm: "15pt" }}
                color={userLiked ? "brand.100" : "rgb(129, 131, 132)"}
              />
              <Text fontSize={{ base: "10pt", sm: "11pt" }} color="#777">
                {post.likes.length > 0 ? post.likes.length : "Like"}
              </Text>
            </Flex>
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
            >
              <Icon
                as={RiChat1Fill}
                mr={1}
                fontSize={{ base: "12pt", sm: "15pt" }}
                color="#777"
              />
              <Text fontSize={{ base: "10pt", sm: "11pt" }} color="#777">
                {post.numComments}
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
                      fontSize={{ base: "12pt", sm: "15pt" }}
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
        </Stack>
      </Flex>
    </Flex>
  );
};
export default SinglePost;
