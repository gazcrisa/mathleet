import React from "react";
import { Flex, Image } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  return (
    <Flex
      bg="#1c1c1c"
      height="60px"
      padding="6px 12px"
      justifyContent={{ md: "space-between" }}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        cursor="pointer"
        onClick={() => router.push(`/`)}
      >
        <Image
          display={{ base: "none", md: "unset" }}
          src="/images/Logo_mathleet_blue_white.png"
          height="22px"
        />

        <Image
          display={{ sm: "flex", md: "none" }}
          src="/images/Logo_mathleet_blue_favicon.png"
          height="24px"
        />
      </Flex>
      <SearchInput />

      <RightContent user={user as User} />
    </Flex>
  );
};
export default Navbar;
