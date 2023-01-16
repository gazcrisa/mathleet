import { Stack } from "@chakra-ui/react";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase/clientApp";
import usePosts from "../../hooks/usePosts";
import useUser from "../../hooks/useUser";
import { Post } from "../../types";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

const Posts: React.FC = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const {
    postStateValue,
    setPostStateValue,
    onLike,
    onDeletePost,
    onSelectPost,
  } = usePosts();

  const {onSavePost} = useUser();

  const getPosts = async () => {
    console.log("getPosts");
    setLoading(true);
    try {
      // get posts
      const postsQuery = query(
        collection(firestore, "posts"),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPostStateValue((prev: any) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack spacing={{ base: "1", md: "2" }}>
          {postStateValue.posts.map((p: Post) => (
            <PostItem
              key={p.id}
              post={p}
              userIsCreator={user?.uid === p.creatorId}
              userLiked={p.likes.includes(user?.uid!)}
              onLike={onLike}
              onDeletePost={onDeletePost}
              onSelectPost={onSelectPost}
              onSavePost={onSavePost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
