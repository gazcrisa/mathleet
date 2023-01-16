import { Flex } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type ReversePageContentProps = {
    children: ReactNode;
};

const ReversePageContent: React.FC<ReversePageContentProps> = ({ children }) => {
  return (
    <Flex justify="center" p={{ base: "4px 0px", md: "12px 0px" }}>
      <Flex width="100%" justify="center" maxWidth="860px">
      <Flex
          direction="column"
          display={{ base: "none", md: "flex" }}
          mr={{ base: 0, md: 6 }}
          flexGrow={1}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
      <Flex
          direction="column"
          width={{ base: "100%", md: "85%" }}
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default ReversePageContent;
