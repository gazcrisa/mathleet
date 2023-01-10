import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PageContent from "../../components/Layout/PageContent";
import { auth, firestore } from "../../firebase/clientApp";
import usePosts from "../../hooks/usePosts";
import Comments from "../../components/Posts/Comments/Comments";
import SinglePost from "../../components/Posts/SinglePost";
import PostLoader from "../../components/Posts/PostLoader";
import PageNotFound from "../../components/PageNotFound";
import { Post } from "../../types";
import SidePanel from "../../components/SidePanel/SidePanel";

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [postExists, setPostExists] = useState(true);
  const { postStateValue, setPostStateValue, onDeletePost, onLike } =
    usePosts();
  const router = useRouter();

  const fetchPost = async (postId: string) => {
    setLoading(true);

    try {
      const postDocRef = doc(firestore, "posts", postId);
      console.log("postDocRef", postDocRef);
      const postDoc = await getDoc(postDocRef);

      if (!postDoc.exists()) {
        setPostExists(false);
        return;
      }

      setPostExists(true);

      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error: any) {
      console.log("fetchPost error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const { pid } = router.query;
    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);

  useEffect(() => {
    const { pid } = router.query;
    if (pid) {
      fetchPost(pid as string);
    }
  }, [router.query, user]);

  return (
    <>
      {!postExists ? (
        <PageNotFound message="Sorry, that post does not exist anymore." />
      ) : (
        <PageContent>
          {!loading && postStateValue.selectedPost ? (
            <>
              <SinglePost
                post={postStateValue.selectedPost}
                userIsCreator={
                  user?.uid === postStateValue.selectedPost?.creatorId
                }
                onDeletePost={onDeletePost}
                userLiked={postStateValue.selectedPost.likes.includes(
                  user?.uid!
                )}
                onLike={onLike}
              />

              <Comments
                user={user as User}
                postId={postStateValue.selectedPost?.id}
                selectedPost={postStateValue.selectedPost}
              />
            </>
          ) : (
            <PostLoader />
          )}
          <>
            <SidePanel />
          </>
        </PageContent>
      )}
    </>
  );
};
export default PostPage;
