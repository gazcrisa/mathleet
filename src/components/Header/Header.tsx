import { Flex, Text } from "@chakra-ui/react";
import React from "react";

type BlueHeaderProps = {
  title?: string;
  bgColor?: string;
  textColor?: string;
};

const BlueHeader: React.FC<BlueHeaderProps> = ({title, bgColor, textColor}) => {
  return (
    <Flex
      align={{base: "center", md: "flex-end"}}
      justify={{base: "center"}}
      color={textColor ? textColor : "white"}
      width="100%"
      p="6px 10px"
      bg={bgColor ? bgColor : "blue.500"}
      height="34px"
      borderRadius={{base: "0px", md: "4px 4px 0px 0px"}}
      fontWeight={600}
      backgroundSize="cover"
    >
      <Text fontSize="10pt" fontWeight={700}>
        {title}
      </Text>
    </Flex>
  );
};
export default BlueHeader;
