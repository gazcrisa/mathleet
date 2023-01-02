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
import { authModalState } from "../../../atoms/authModalAtom";

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
        replies: [],
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

  const onCreateReply = async (replyText: string, parentId: string) => {
    // check for a user, if not, open auth modal
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return false;
    }

    try {
      const batch = writeBatch(firestore);

      const commentDocRef = doc(firestore, "comments", parentId);
      const parentComment = (await getDoc(commentDocRef)).data();
      const updatedComments = [...comments];

      if (!parentComment) {
        return false;
      }

      const newReply: Reply = {
        id: uuidv4(),
        creatorId: user.uid,
        creatorDisplayText: user.displayName ? user.displayName : "Anonymous",
        parentId: parentComment.id,
        text: replyText,
        createdAt: { seconds: Math.round(Date.now() / 1000) } as Timestamp,
        likes: [],
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
      return true;
    } catch (error) {
      console.log("onCreateReplyError", error);
      return false;
    }
  };

  const onLikeComment = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    comment: Comment
  ) => {
    console.log("on like comment called");
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
        await updateDoc(commentDocRef, { likes: arrayUnion(user.uid) });
        updatedComment.likes = [...likes, user.uid];
      } else {
        await updateDoc(commentDocRef, { likes: arrayRemove(user.uid) });
        updatedComment.likes = likes.filter((uid) => uid !== user.uid);
      }

      // update array of comments state
      const index = comments.findIndex((c) => c.id === comment.id);
      updatedComments[index] = updatedComment;
      setComments(updatedComments);

      console.log("new comments,", comments);
    } catch (error) {
      console.log("onLikeComment error", error);
    }
  };

  const onDeleteComment = async (comment: Comment) => {
    setLoadingDeleteId(comment.id);
    try {
      const batch = writeBatch(firestore);

      // delete the comment document
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      const numReplies = comment.replies.length;

      // update post numberOfComments -1
      const postDocRef = doc(firestore, "posts", comment.postId);
      batch.update(postDocRef, {
        numComments: increment(-1 * (numReplies + 1)),
      });

      await batch.commit();

      // update client recoil state
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numComments: prev.selectedPost?.numComments! - (1 + numReplies),
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

  const onLikeReply = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    reply: Reply
  ) => {
    console.log("on like reply called");
    event.stopPropagation();
    // check for a user, if not, open auth modal
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    try {
      const batch = writeBatch(firestore);
      const { likes } = reply;
      const existingLike = likes.includes(user.uid);
      const commentDocRef = doc(firestore, "comments", reply.parentId);
      const parentComment = (await getDoc(commentDocRef)).data();
      const updatedParentComment = { ...parentComment };

      if (!parentComment) {
        return;
      }

      //  get index of reply
      const replyIndex = parentComment.replies.findIndex(
        (r: Reply) => r.id == reply.id
      );
      let updatedReplyLikes = [...parentComment.replies[replyIndex].likes];

      if (!existingLike) {
        updatedReplyLikes = [...updatedReplyLikes, user.uid];
        updatedParentComment.replies[replyIndex].likes = updatedReplyLikes;
        batch.set(commentDocRef, updatedParentComment);
      } else {
        updatedReplyLikes = updatedReplyLikes.filter((uid) => uid !== user.uid);
        updatedParentComment.replies[replyIndex].likes = updatedReplyLikes;
        batch.set(commentDocRef, updatedParentComment);
      }

      // update comments state
      const updatedComments = [...comments];
      const parentCommentIndex = comments.findIndex(
        (c) => c.id === parentComment.id
      );
      updatedComments[parentCommentIndex] = updatedParentComment as Comment;

      setComments(updatedComments);

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          comments: updatedComments
        } as Post,
      }));

      batch.commit();
    } catch (error) {
      console.log("onLikeReply error", error);
    }
  };

  const onDeleteReply = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    reply: Reply
  ) => {
    console.log("on delete reply called");
    event.stopPropagation();
    // check for a user, if not, open auth modal
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return false;
    }
    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(firestore, "comments", reply.parentId);
      const parentComment = (await getDoc(commentDocRef)).data();
      const updatedParentComment = { ...parentComment };

      if (!parentComment) {
        return false;
      }

      const updatedReplies = parentComment.replies.filter(
        (r: Reply) => r.id !== reply.id
      );
      updatedParentComment.replies = updatedReplies;

      // update the comment now that reply was removed
      batch.set(commentDocRef, updatedParentComment);

      // update post numComments -1
      const postDocRef = doc(firestore, "posts", selectedPost?.id! as string);
      batch.update(postDocRef, {
        numComments: increment(-1),
      });

      await batch.commit();

      // update comments state
      const updatedComments = [...comments];
      const parentCommentIndex = comments.findIndex(
        (c) => c.id === parentComment.id
      );
      updatedComments[parentCommentIndex] = updatedParentComment as Comment;

      setComments(updatedComments);

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numComments: prev.selectedPost?.numComments! -1,
          comments: updatedComments
        } as Post,
      }));

      batch.commit();
      return true;
    } catch (error) {
      console.log("onDeleteReply error", error);
      return false;
    }
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
                      onLikeReply={onLikeReply}
                      onDeleteComment={onDeleteComment}
                      userId={user?.uid}
                      userLiked={comment.likes.includes(user?.uid!)}
                      onCreateReply={onCreateReply}
                      onDeleteReply={onDeleteReply}
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
