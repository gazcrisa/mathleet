import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import PageContent from "../components/Layout/PageContent";
import NewPostForm from "../components/Posts/NewPostForm";
import { auth } from "../firebase/clientApp";

type SubmitPostPageProps = {};

const SubmitPostPage: React.FC<SubmitPostPageProps> = () => {
  const [user] = useAuthState(auth);

  return (
    <PageContent>
      <>
        <Flex direction="column">
          <Box p="14px" bg="#222" borderBottom="1px solid" borderColor="#444">
            <Text
              fontSize="22px"
              fontWeight="500"
              lineHeight="22px"
              color="gray.300"
            >
              Create a post
            </Text>
          </Box>
          {user && <NewPostForm user={user} />}
        </Flex>
      </>
      <></>
    </PageContent>
  );
};
export default SubmitPostPage;
