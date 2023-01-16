import { Box, Stack } from "@chakra-ui/react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ReversePageContent from "../../components/Layout/ReversePageContent";
import PageNotFound from "../../components/PageNotFound";
import PostLoader from "../../components/Posts/PostLoader";
import ProfilePanel from "../../components/Profile/ProfilePanel";
import UserStats from "../../components/Profile/UserStats";
import { auth, firestore } from "../../firebase/clientApp";
import useUser from "../../hooks/useUser";
import { Post } from "../../types";
import { UserScore } from "../../types/user";

const UserPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState(true);
  const [scores, setScores] = useState<UserScore[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const { userStateValue, fetchSelectedUser } = useUser();
  const router = useRouter();

  const fetchUser = async (uid: string) => {
    setLoading(true);
    try {
      const success = await fetchSelectedUser(uid);

      if (!success) {
        throw new Error("Failed to fetch the current user");
      }
    } catch (error: any) {
      setUserExists(false);
    }
    setLoading(false);
  };

  const getScores = async (uid: string) => {
    try {
      const scoresQuery = query(
        collection(firestore, "users", `${uid}/userScores`),
        limit(5)
      );
      const scoreDocs = await getDocs(scoresQuery);
      const scores = scoreDocs.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as UserScore)
      );

      setScores(scores);
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
  };

  const getUserPosts = async (uid: string) => {
    const userPostsQuery = query(
      collection(firestore, "posts"),
      where("creatorId", "==", uid),
      limit(5)
    );

    const userPostDocs = await getDocs(userPostsQuery);
    const userPosts = userPostDocs.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Post)
    );

    setPosts(userPosts);
  };

  useEffect(() => {
    const { uid } = router.query;
    if (uid) {
      console.log("current user state", userStateValue);
      fetchUser(uid as string);
      getScores(uid as string);
      getUserPosts(uid as string);
    }
  }, [router.query]);

  return (
    <>
      {!userExists ? (
        <PageNotFound message="Sorry, that user was not found." />
      ) : !loading && userStateValue.selectedUser ? (
        <ReversePageContent>
          <>
            <Stack>
              <ProfilePanel
                isCurrentUser={user?.uid === userStateValue.selectedUser.uid}
                selectedUser={userStateValue.selectedUser}
              />
            </Stack>
          </>
          <>
            <Box display={{ md: "none" }} mb={2}>
              <ProfilePanel
                isCurrentUser={user?.uid === userStateValue.selectedUser.uid}
                selectedUser={userStateValue.selectedUser}
              />
            </Box>
            <UserStats
              scores={scores}
              recentPosts={posts}
              isCurrentUser={user?.uid === userStateValue.selectedUser?.uid}
              currentUserUID={user?.uid}
            />
          </>
        </ReversePageContent>
      ) : (
        <PostLoader />
      )}
    </>
  );
};
export default UserPage;
