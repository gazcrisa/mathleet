import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  Box,
} from "@chakra-ui/react";
import { MdOutlineLogin } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";

const MobileMenu: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  return (
    <Box display={{ md: "none" }}>
      <Menu>
        <MenuButton
          cursor="pointer"
          padding="6px 6px"
          borderRadius={4}
          _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
        >
          <Flex align="center">
            <Flex align="center">
              <Icon color="#cccccc" as={VscAccount} fontSize={{ base: "15pt", sm: "17pt" }}/>
            </Flex>
            {/* <ChevronDownIcon color="white" fontSize={20} /> */}
          </Flex>
        </MenuButton>
        <MenuList bg="#222" border="1px solid #444">
          <MenuItem
            bg="#222"
            color="gray.200"
            fontSize="10pt"
            fontWeight={700}
            _hover={{
              bg: "rgba(102,122,128,0.10196078431372549)",
              color: "white",
            }}
            onClick={() => setAuthModalState({ open: true, view: "login" })}
          >
            <Flex align="center">
              <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
              Log In / Sign Up
            </Flex>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};
export default MobileMenu;
