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
  arrayUnion,
  collection,
  doc,
  getDoc,
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
import CommentItem, { Comment, Reply } from "./CommentItem";
import { v4 as uuidv4 } from "uuid";

type CommentsProps = {
  user: User;
  postId: string;
  selectedPost: Post;
};

const Comments: React.FC<CommentsProps> = ({ user, postId, selectedPost }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createCommentLoading, setCreateCommentLoading] = useState(false);
  const [createReplyLoading, setCreateReplyLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState("");
  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async (commentText: string) => {
    // create a comment document
    // update post numberOfComments
    setCreateCommentLoading(true);
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
        replies: [],
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
    setCreateCommentLoading(false);
  };

  const onCreateReply = async (replyText: string, parentId: string) => {
    setCreateReplyLoading(true);
    try {
      const batch = writeBatch(firestore);

      const commentDocRef = doc(firestore, "comments", parentId);
      const parentComment = (await getDoc(commentDocRef)).data();
      const updatedComments = [...comments];

      if (!parentComment) {
        return;
      }

      const newReply: Reply = {
        id: uuidv4(),
        creatorId: user.uid,
        creatorDisplayText: user.displayName ? user.displayName : "Anonymous",
        parentId: parentComment.id,
        text: replyText,
        createdAt: { seconds: Math.round(Date.now() / 1000) } as Timestamp,
      };

      await updateDoc(commentDocRef, { replies: arrayUnion(newReply) });

      newReply.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      // update post numComments +1
      const postDocRef = doc(firestore, "posts", selectedPost?.id! as string);
      batch.update(postDocRef, {
        numComments: increment(1),
      });

      await batch.commit();

      // update client recoil state
      const index = comments.findIndex((c) => c.id === parentId);
      updatedComments[index].replies = [...parentComment.replies, newReply];
      setComments(updatedComments);
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numComments: prev.selectedPost?.numComments! + 1,
        } as Post,
      }));
    } catch (error) {
      console.log("onCreateReplyError", error);
    }
    setCreateReplyLoading(false);
  };

  const onDeleteComment = async (comment: any) => {
    setLoadingDeleteId(comment.id);
    try {
      const batch = writeBatch(firestore);

      // delete the comment document
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      // update post numberOfComments -1
      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numComments: increment(-1),
      });

      await batch.commit();

      // update client recoil state
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numComments! - 1,
        } as Post,
      }));

      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error) {
      console.log("onDeleteComment error", error);
    }
    setLoadingDeleteId("");
  };

  const getPostComments = async () => {
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
    console.log("called get comments");
    getPostComments();
  }, [postId]);

  return (
    <Flex direction="column" bg="#222" justifyContent={"center"} align="center">
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
            createLoading={createCommentLoading}
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
                      key={comment.id}
                      comment={comment}
                      onDeleteComment={onDeleteComment}
                      loadingDelete={loadingDeleteId === comment.id}
                      userId={user?.uid}
                      onCreateReply={onCreateReply}
                      createReplyLoading={createReplyLoading}
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
