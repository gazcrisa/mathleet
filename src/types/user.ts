import { Timestamp } from "firebase/firestore";
import { ProblemType } from "../enums/problems";

export type User = {
  uid: string;
  email?: string;
  displayName: string;
  bio?: string;
  company?: string;
  comments?: [];
  scores?: UserScore[]
  likes?: [];
  posts?: [];
  rank?: number;
  school?: string;
  imageURL?: string;
};

export type UserScore = {
  id: string;
  score: number;
  level: string;
  type: ProblemType;
  createdAt: Timestamp;
};

export type SavedPost = {
  id: string,
  postTitle: string;
}
