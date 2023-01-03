import React from "react";
import { Flex, Button, Text } from "@chakra-ui/react";
import Link from "next/link";

const PostNotFound: React.FC = () => {
  return (
    <Flex
      mt="0.5px"
      bg="#1c1c1c"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        borderRadius="5px"
      >
        <Text color="#cccccc">Sorry, that post does not exist anymore.</Text>
        <Link href="/">
          <Button mt={4}>BACK</Button>
        </Link>
      </Flex>
    </Flex>
  );
};
export default PostNotFound;
