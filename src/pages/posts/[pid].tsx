import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "../../atoms/postsAtom";
import About from "../../components/About";
import PageContent from "../../components/Layout/PageContent";
import { auth, firestore } from "../../firebase/clientApp";
import usePosts from "../../hooks/usePosts";
import Comments from "../../components/Posts/Comments/Comments";
import SinglePost from "../../components/Posts/SinglePost";

const PostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onDeletePost, onLike } =
    usePosts();
  const router = useRouter();

  const fetchPost = async (postId: string) => {
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
  };

  useEffect(() => {
    const { pid } = router.query;
    fetchPost(pid as string);
  }, [router.query]);
  return (
    <PageContent>
      {postStateValue.selectedPost && (
        <>
          <SinglePost
            post={postStateValue.selectedPost}
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
            onDeletePost={onDeletePost}
          />

          <Comments
            user={user as User}
            selectedPost={postStateValue.selectedPost}
          />
        </>
      )}
      <>
        <About />
      </>
    </PageContent>
  );
};
export default PostPage;
