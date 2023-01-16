import React from "react";
import { Flex } from "@chakra-ui/react";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButtons from "./AuthButtons";
import UserMenu from "./UserMenu";
import { User } from "firebase/auth";

type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justifyContent="space-between" alignItems="center">
        {user ? <UserMenu user={user}/> : <AuthButtons />}
      </Flex>
    </>
  );
};
export default RightContent;
