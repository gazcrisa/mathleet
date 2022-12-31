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

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { postStateValue, setPostStateValue, onDeletePost, onLike } =
    usePosts();
  const router = useRouter();

  const fetchPost = async (postId: string) => {
    setLoading(true);
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocRef);
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
  return (
    <PageContent>
      {!loading && postStateValue.selectedPost ? (
        <>
          <SinglePost
            post={postStateValue.selectedPost}
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
            onDeletePost={onDeletePost}
            userLiked={postStateValue.selectedPost.likes.includes(user?.uid!)}
            onLike={onLike}
          />

          <Comments
            user={user as User}
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
  );
};
export default PostPage;
