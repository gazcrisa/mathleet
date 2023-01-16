import { atom } from "recoil";
import { SavedPost, User } from "../types/user";

interface UserState {
  savedPosts: SavedPost[]
  selectedUser: User | null;
}

const defaultUserState: UserState = {
  savedPosts: [],
  selectedUser: null,
};

export const userState = atom<UserState>({
  key: "userState",
  default: defaultUserState,
});
