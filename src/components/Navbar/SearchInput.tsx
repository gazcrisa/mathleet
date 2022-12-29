import React from "react";
import { Flex, InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { User } from "firebase/auth";

type SearchInputProps = {
  user: User;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {
  return (
    <Flex flexGrow={1} maxWidth="600px" mr={2} alignItems="center">
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          color="#666"
          // children={<SearchIcon mb={2} />}
        >
          <SearchIcon mb={2}/>
        </InputLeftElement>
        <Input
          color="white"
          placeholder="Search Posts"
          fontSize="14pt"
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
            color: "gray.300"
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
