import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { RiChat1Fill } from "react-icons/ri";

type CommentButtonProps = {};

const CommentButton: React.FC<CommentButtonProps> = () => {
  return (
    <Flex
      align="center"
      p="8px 0px"
      borderRadius={4}
      _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
      cursor="pointer"
    >
      <Icon
        as={RiChat1Fill}
        mr={1}
        fontSize={{ base: "8pt", sm: "10pt" }}
        color={false ? "brand.100" : "rgb(129, 131, 132)"}
        onClick={() => {}}
      />
      <Text fontSize={{ base: "10pt" }} color="#777">
        {false ? 12 : "Reply"}
      </Text>
    </Flex>
  );
};
export default CommentButton;
