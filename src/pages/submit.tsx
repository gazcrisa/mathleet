import { Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtom";
import PageContent from "../components/Layout/PageContent";
import NewPostForm from "../components/Posts/NewPostForm";
import { auth } from "../firebase/clientApp";

type SubmitPostPageProps = {};

const SubmitPostPage: React.FC<SubmitPostPageProps> = () => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);

  useEffect(() => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
  }, [user]);

  return (
    <PageContent>
      <>
        <Flex direction="column">{user && <NewPostForm user={user} />}</Flex>
      </>
      <></>
    </PageContent>
  );
};
export default SubmitPostPage;
