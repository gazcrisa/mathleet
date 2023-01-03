import { Timestamp } from "firebase/firestore";

export type Post = {
    id: string;
    creatorId: string;
    creatorDisplayName: string;
    title: string;
    body: string;
    numComments: number;
    likes: string[];
    imageURL?: string;
    createdAt: Timestamp;
  };
