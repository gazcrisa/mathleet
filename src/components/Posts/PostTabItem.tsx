import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { TabItem } from "./NewPostForm";

type PostTabItemProps = {
  item: TabItem;
  selected: boolean;
  setSelectedTab: (value: string) => void;
};

const PostTabItem: React.FC<PostTabItemProps> = ({
  item,
  selected,
  setSelectedTab,
}) => {
  return (
    <Flex
      justify="center"
      align="center"
      flexGrow={1}
      p="14px 0px"
      cursor="pointer"
      fontWeight={700}
      _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
      color="#cccccc"
      borderBottom="0.5px solid"
      borderBottomColor="#444"
      borderRightColor="#444"
      onClick={() => setSelectedTab(item.title)}
    >
      <Flex align="center" height="20px" mr={2}>
        <Icon height="100%" as={item.icon} fontSize={18} />
      </Flex>
      <Text fontSize="12pt">{item.title}</Text>
    </Flex>
  );
};
export default PostTabItem;
