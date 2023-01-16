import { Flex, Icon, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { MdPostAdd } from "react-icons/md";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/authModalAtom";
import { auth } from "../../firebase/clientApp";

type CreatePostLinkProps = {};

const CreatePostLink: React.FC<CreatePostLinkProps> = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);

  const onClick = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    router.push(`/submit`);
  };
  return (
    <Flex
      justify="space-evenly"
      align="center"
      height="75px"
      borderRadius={4}
      bg="#1c1c1c"
      p={2}
      mb={{base: "1"}}
      onClick={onClick}
      cursor="pointer"
    >
      <Icon as={MdPostAdd} fontSize={{ base: "18pt", sm: "22pt" }} color="gray.400" mr={2} />
      <Input
        placeholder="Create Post"
        fontSize={{ base: "11pt", sm: "12pt" }}
        _placeholder={{ color: "#666" }}
        bg="#333"
        borderColor="#444"
        height="40px"
        width="90%"
        borderRadius={4}
        mr={4}
      />
    </Flex>
  );
};
export default CreatePostLink;
