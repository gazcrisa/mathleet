import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { postState } from "../atoms/postsAtom";
import { auth, firestore, storage } from "../firebase/clientApp";
import { Post } from "../types";

const usePosts = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const setAuthModalState = useSetRecoilState(authModalState);

  const onLike = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    post: Post
  ) => {
    event.stopPropagation();
    // check for a user, if not, open auth modal
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    try {
      const { likes } = post;
      const existingLike = likes.includes(user.uid);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      const postDocRef = doc(firestore, "posts", post.id);

      if (!existingLike) {
        await updateDoc(postDocRef, { likes: arrayUnion(user.uid) });
        updatedPost.likes = [...likes, user.uid];
      } else {
        await updateDoc(postDocRef, { likes: arrayRemove(user.uid) });
        updatedPost.likes = likes.filter((uid) => uid !== user.uid);
      }

      // update array of posts state
      const postIndex = postStateValue.posts.findIndex((p) => p.id === post.id);
      updatedPosts[postIndex] = updatedPost;
      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
      }));

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }
    } catch (error) {
      console.log("onLike error", error);
    }
  };

  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/posts/${post.id}`);
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // check if image, delete if exists
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }
      //delete post document from firestore
      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);

      // update recoil state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));

      return true;
    } catch (error) {}
    return false;
  };

  useEffect(() => {
    if (!user) {
      setPostStateValue((prev) => ({
        ...prev,
        postLikes: [],
      }));
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onLike,
    onDeletePost,
    onSelectPost,
  };
};
export default usePosts;
