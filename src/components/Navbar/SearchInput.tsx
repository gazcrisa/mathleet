import React from "react";
import { Flex, InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const SearchInput: React.FC = () => {
  return (
    <Flex
      flexGrow={1}
      maxWidth="500px"
      mr={{ base: 1, sm: 2 }}
      alignItems="center"
    >
      <InputGroup>
        <InputLeftElement
          className="inputLeft"
          pointerEvents="none"
          color="#666"
          children={
            <SearchIcon mb={2} fontSize={{ base: "11pt", sm: "15pt" }} />
          }
        />
        <Input
          color="white"
          placeholder="Search Posts"
          fontSize={{ base: "10pt", sm: "12pt" }}
          borderRadius="60px"
          _placeholder={{ color: "#666" }}
          _hover={{
            bg: "#222",
            border: "1px solid",
            borderColor: "gray.100",
          }}
          _focus={{
            outline: "none",
            bg: "#222",
            border: "1px solid",
            borderColor: "gray.100",
            color: "gray.300",
          }}
          height="38px"
          bg="#333"
          border="#444"
        />
      </InputGroup>
    </Flex>
  );
};
export default SearchInput;
