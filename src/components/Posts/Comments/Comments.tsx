import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Post, postState } from "../../../atoms/postsAtom";
import { firestore } from "../../../firebase/clientApp";
import CommentInput from "./CommentInput";

import { authModalState } from "../../../atoms/authModalAtom";
import { Comment } from "../../../types";
import CommentItem from "./CommentItem";

type CommentsProps = {
  user?: User | null;
  postId: string;
  selectedPost: Post;
};

const Comments: React.FC<CommentsProps> = ({ user, postId, selectedPost }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState("");
  const setPostState = useSetRecoilState(postState);

  const setAuthModalState = useSetRecoilState(authModalState);

  const onCreateComment = async (commentText: string) => {
    // check for a user, if not, open auth modal
    console.log("onCreate Comment");
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);

      // create a comment document
      const commentDocRef = doc(collection(firestore, "comments"));

      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.displayName ? user.displayName : "Anonymous",
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
        likes: [],
      };

      batch.set(commentDocRef, newComment);

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      // update post numComments +1
      const postDocRef = doc(firestore, "posts", selectedPost?.id! as string);
      batch.update(postDocRef, {
        numComments: increment(1),
      });

      await batch.commit();

      // update client recoil state
      setCommentText("");
      setComments((prev) => [...prev, newComment]);
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numComments: prev.selectedPost?.numComments! + 1,
        } as Post,
      }));
    } catch (error) {
      console.log("onCreateComment error", error);
    }
    setCreateLoading(false);
  };

  const onLikeComment = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    comment: Comment
  ) => {
    console.log("onLike Comment");
    event.stopPropagation();
    // check for a user, if not, open auth modal
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    try {
      const { likes } = comment;
      const existingLike = likes.includes(user.uid);
      const updatedComment = { ...comment };
      const updatedComments = [...comments];
      const commentDocRef = doc(firestore, "comments", comment.id);

      if (!existingLike) {
        updatedComment.likes = [...likes, user.uid];
      } else {
        updatedComment.likes = likes.filter((uid) => uid !== user.uid);
      }

      // update state before updating db because if the comment the user is liking was deleted, we will still show
      // the comment on the screen anyways
      const index = comments.findIndex((c) => c.id === comment.id);
      updatedComments[index] = updatedComment;
      setComments(updatedComments);

      if (!existingLike) {
        await updateDoc(commentDocRef, { likes: arrayUnion(user.uid) });
      } else {
        await updateDoc(commentDocRef, { likes: arrayRemove(user.uid) });
      }
    } catch (error) {
      console.log("onLikeComment error", error);
    }
  };

  const onDeleteComment = async (comment: Comment) => {
    console.log("onDelete Comment");
    setLoadingDeleteId(comment.id);
    try {
      const batch = writeBatch(firestore);

      // delete the comment document
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      // update post numberOfComments -1
      const postDocRef = doc(firestore, "posts", comment.postId);
      batch.update(postDocRef, {
        numComments: increment(-1),
      });

      await batch.commit();

      // update client recoil state
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numComments: prev.selectedPost?.numComments! - 1,
        } as Post,
      }));

      setComments((prev) => prev.filter((item) => item.id !== comment.id));

      setLoadingDeleteId("");
      return true;
    } catch (error) {
      console.log("onDeleteComment error", error);
      setLoadingDeleteId("");
      return false;
    }
  };

  const getPostComments = async () => {
    console.log("getComments");
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error) {
      console.log("getPostComments error", error);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost]);

  return (
    <Flex
      direction="column"
      bg="#1c1c1c"
      justifyContent={"center"}
      align="center"
    >
      <Flex
        direction="column"
        width={{ base: "98%", sm: "90%" }}
        border="none"
        color="white"
        mt={"15px"}
        padding={"0px 10px"}
        borderRadius={"4px 4px 0px 0px"}
        _hover={{
          borderColor: "none",
        }}
      >
        {!fetchLoading && (
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            createLoading={createLoading}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>
      <Flex
        direction="column"
        width="100%"
        border="none"
        color="white"
        _hover={{
          borderColor: "none",
        }}
        borderTop="0.5px solid"
        borderColor="#444"
      >
        <Stack spacing={6} p={0}>
          {fetchLoading ? (
            <>
              {[0, 1, 2].map((item) => (
                <Box key={item} padding="6" bg="#333">
                  <SkeletonCircle size="10" />
                  <SkeletonText mt="4" noOfLines={2} spacing="4" />
                </Box>
              ))}
            </>
          ) : (
            <>
              {comments.length === 0 ? (
                <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  borderColor="gray.100"
                  p={10}
                >
                  <Text fontWeight={700} opacity={0.3} color={"gray.200"}>
                    No Comments Yet
                  </Text>
                </Flex>
              ) : (
                <>
                  {comments.map((comment) => (
                    <CommentItem
                      user={user}
                      key={comment.id}
                      userIsCreator={user?.uid === selectedPost.creatorId}
                      comment={comment}
                      onLikeComment={onLikeComment}
                      onDeleteComment={onDeleteComment}
                      userId={user?.uid}
                      userLiked={comment.likes.includes(user?.uid!)}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </Stack>
      </Flex>
    </Flex>
  );
};
export default Comments;
