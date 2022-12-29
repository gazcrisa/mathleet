import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
} from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import { auth } from "../../../firebase/clientApp";
import { VscAccount } from "react-icons/vsc";

type UserMenuProps = {
  user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        _hover={{ outline: "1px solid", outlineColor: "rgb(129, 131, 132)" }}
      >
        <Flex align="center">
          <Flex align="center">
            <Icon fontSize={24} mr={1} color="gray.300" as={VscAccount} />
          </Flex>
          <ChevronDownIcon color="white" fontSize={20} />
        </Flex>
      </MenuButton>
      <MenuList bg="#222" border="1px solid #444">
        {user && (
          <>
            <MenuItem
              bg="#222"
              color="gray.200"
              fontSize="12pt"
              fontWeight={700}
              _hover={{
                bg: "rgba(102,122,128,0.10196078431372549)",
                color: "white",
              }}
            >
              <Flex align="center">
                <Icon fontSize={20} mr={2} as={CgProfile} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              bg="#222"
              color="gray.200"
              fontSize="12pt"
              fontWeight={700}
              _hover={{
                bg: "rgba(102,122,128,0.10196078431372549)",
                color: "white",
              }}
              onClick={logout}
            >
              <Flex align="center">
                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                Log Out
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};
export default UserMenu;
