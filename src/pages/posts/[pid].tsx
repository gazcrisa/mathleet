import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "../../atoms/postsAtom";
import About from "../../components/About";
import PageContent from "../../components/Layout/PageContent";
import { auth, firestore } from "../../firebase/clientApp";
import usePosts from "../../hooks/usePosts";
import Comments from "../../components/Posts/Comments/Comments";
import SinglePost from "../../components/Posts/SinglePost";
import PostLoader from "../../components/Posts/PostLoader";
import PostNotFound from "../../components/Posts/PostNotFound";

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [postExists, setPostExists] = useState(true);
  const [error, setError] = useState("");
  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    onLike,
  } = usePosts();
  const router = useRouter();

  const fetchPost = async (postId: string) => {
    setLoading(true);

    try {
      const postDocRef = doc(firestore, "posts", postId);
      console.log("postDocRef", postDocRef)
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
    console.log("use effect 1 called!", postStateValue);
    const { pid } = router.query;
    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);

  useEffect(() => {
    console.log("use effect 2 called!", postStateValue);
    const { pid } = router.query;
    if (pid) {
      fetchPost(pid as string);
    }
    
  }, [router.query, user])

  return (
    <>
      {!postExists ? (
        <PostNotFound />
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
            <About />
          </>
        </PageContent>
      )}
    </>
  );
};
export default PostPage;
