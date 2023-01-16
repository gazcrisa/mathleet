import React from "react";
import { Flex, Image } from "@chakra-ui/react";
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
      // justifyContent={{ md: "space-between" }}
      justify="center"
    >
      <Flex
        width={{ base: "100%", md: "80%" }}
        align="center"
        justify="space-between"
      >
        <Flex align="center" cursor="pointer" onClick={() => router.push(`/`)}>
          <Image
            width={{ base: "120px", md: "140px" }}
            mr={{ md: 2 }}
            src="/images/Logo_mathleet_blue_white.png"
          />
        </Flex>

        <RightContent user={user} />
      </Flex>
    </Flex>
  );
};
export default Navbar;
