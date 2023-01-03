import { Timestamp } from "firebase/firestore";

export type Comment = {
    id: string;
    creatorId: string;
    creatorDisplayText: string;
    postId: string;
    postTitle: string;
    text: string;
    createdAt: Timestamp;
    likes: string[];
  };
