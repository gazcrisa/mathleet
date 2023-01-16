import { Flex } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type PageContentProps = {
  children: ReactNode;
  widthPercentage?: string;
};

const PageContent: React.FC<PageContentProps> = ({
  children,
  widthPercentage,
}) => {
  const getWidth = () => {
    return widthPercentage ? widthPercentage : "85%";
  };
  
  return (
    <Flex justify="center" p={{ base: "4px 0px", md: "12px 0px" }}>
      <Flex width="100%" justify="center" maxWidth="860px">
        <Flex
          direction="column"
          width={{ base: "100%", md: `${getWidth()}` }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
        <Flex
          direction="column"
          display={{ base: "none", md: "flex" }}
          flexGrow={1}
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PageContent;
