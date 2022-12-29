import React from "react";
import { Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButtons from "./AuthButtons";
import Icons from "./Icons";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

type RightContentProps = {
  user: User;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justifyContent="space-between" alignItems="center">
        {!user && <AuthButtons />}
        {user ? <UserMenu user={user} /> : <MobileMenu />}
      </Flex>
    </>
  );
};
export default RightContent;
