import React from "react";
import { Flex, Image, Stack } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <Flex
      bg="#222"
      height="60px"
      padding="6px 12px"
      justifyContent={{ md: "space-between" }}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 1, sm: 2 }}
        cursor="pointer"
        onClick={() => {}}
      >
        <Image
          display={{ base: "none", md: "unset" }}
          src="/images/Logo_mathleet_blue_white.png"
          height="26px"
        />

        <Image
          display={{ sm: "flex", md: "none" }}
          src="/images/Logo_mathleet_blue_favicon.png"
          height="24px"
        />
      </Flex>
      <SearchInput user={user as User} />
      <RightContent user={user as User} />
    </Flex>
  );
};
export default Navbar;
