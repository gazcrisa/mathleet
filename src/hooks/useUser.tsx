import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import { userState } from "../atoms/userAtom";
import { auth, firestore } from "../firebase/clientApp";
import { Post } from "../types";
import { SavedPost, User } from "../types/user";

const useUser = () => {
  const [user] = useAuthState(auth);
  const [userStateValue, setUserStateValue] = useRecoilState(userState);
  const setAuthModalState = useSetRecoilState(authModalState);

  const fetchSelectedUser = async (uid: string) => {
    try {
      const userDocRef = doc(firestore, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        return false;
      }

      setUserStateValue((prev) => ({
        ...prev,
        selectedUser: {
          uid: userDoc.id,
          ...userDoc.data(),
        } as User,
      }));
    } catch (error: any) {
      console.log("fetchUser error", error);
      return false;
    }
    return true;
  };

  const onSavePost = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    post: Post
  ) => {
    event.stopPropagation();
    // check for a user, if not, open auth modal
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    console.log("onSavePost called");

    try {
      const savedPostDocRef = doc(firestore, "savedPosts", user.uid);
      let updatedSavedPosts = [...userStateValue.savedPosts];

      const postAlreadySaved =
        updatedSavedPosts?.filter((p: SavedPost) => p.id === post.id).length >
        0;

      if (!postAlreadySaved) {
        const newSavedPost = { id: post.id, postTitle: post.title };
        updatedSavedPosts = [...updatedSavedPosts, newSavedPost];
      } else {
        updatedSavedPosts = updatedSavedPosts.filter(
          (p: SavedPost) => p.id !== post.id
        );
      }

      await setDoc(savedPostDocRef, { savedPosts: updatedSavedPosts });

      setUserStateValue((prev) => ({
        ...prev,
        savedPosts: updatedSavedPosts,
      }));
    } catch (error: any) {
      console.log("savePost error", error);
    }
  };

  const getSavedPosts = async (uid: string) => {
    console.log("called getSavedPosts");
    try {
      // get posts
      const savedPostsDocRef = doc(firestore, "savedPosts", uid);
      const savedPostDoc = await getDoc(savedPostsDocRef);

      if (!savedPostDoc.exists()) {
        return;
      }

      setUserStateValue((prev) => ({
        ...prev,
        savedPosts: [...savedPostDoc.data().savedPosts],
      }));
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      setUserStateValue((prev) => ({
        ...prev,
        currentUser: null,
      }));
    }
  }, [user]);

  return {
    userStateValue,
    setUserStateValue,
    fetchSelectedUser,
    onSavePost,
    getSavedPosts,
  };
};

export default useUser;
