import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { BiLike } from "react-icons/bi";

type LikeButtonProps = {
  onLike: () => void;
};

const LikeButton: React.FC<LikeButtonProps> = ({onLike}) => {
  return (
    <Flex
      align="center"
      p="8px 0px"
      borderRadius={4}
      _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
      cursor="pointer"
    >
      <Icon
        as={BiLike}
        mr={1}
        fontSize={{ base: "8pt", sm: "10pt" }}
        color={false ? "brand.100" : "rgb(129, 131, 132)"}
        onClick={onLike}
      />
      <Text fontSize={{ base: "10pt" }} color="#777">
        {false ? 12 : "Like"}
      </Text>
    </Flex>
  );
};
export default LikeButton;
