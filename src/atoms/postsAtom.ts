import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";
import { Post } from "../types";

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
}

const defaultPostState: PostState = {
  selectedPost: null,
  posts: [],
};

export const postState = atom<PostState>({
  key: "postState",
  default: defaultPostState,
});
