import { Flex, Icon, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsLink45Deg } from "react-icons/bs";
import { MdPostAdd } from "react-icons/md";
import { IoImageOutline } from "react-icons/io5";
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
      bg="#222"
      p={2}
      mb={4}
      onClick={onClick}
      cursor="pointer"
    >
      <Icon as={MdPostAdd} fontSize={30} color="gray.400" mr={4} />
      <Input
        placeholder="Create Post"
        fontSize={{ base: "10pt", sm: "12pt" }}
        _placeholder={{ color: "#666" }}
        bg="#333"
        borderColor="#444"
        height="50px"
        borderRadius={4}
        mr={4}
      />
      <Icon
        as={IoImageOutline}
        fontSize={24}
        mr={4}
        color="gray.400"
        cursor="pointer"
      />
      <Icon as={BsLink45Deg} fontSize={24} color="gray.400" cursor="pointer" />
    </Flex>
  );
};
export default CreatePostLink;
