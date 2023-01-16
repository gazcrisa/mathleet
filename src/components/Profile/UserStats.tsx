import { Stack } from "@chakra-ui/react";
import React from "react";
import { SavedPost, UserScore } from "../../types/user";
import { Post } from "../../types";
import HighScoresTable from "./HighScoresTable";
import RecentPostsTable from "./RecentPostsTable";
import SavedPostsTable from "./SavedPostsTable";

type UserStatsProps = {
  scores: UserScore[];
  recentPosts: Post[];
  isCurrentUser?: boolean;
  currentUserUID?: string;
};

const UserStats: React.FC<UserStatsProps> = ({
  scores,
  recentPosts,
  isCurrentUser,
  currentUserUID
}) => {
  return (
    <Stack spacing={3}>
      <HighScoresTable scores={scores} />
      <RecentPostsTable recentPosts={recentPosts} />
      {isCurrentUser && currentUserUID && <SavedPostsTable uid={currentUserUID}/>}
    </Stack>
  );
};
export default UserStats;
