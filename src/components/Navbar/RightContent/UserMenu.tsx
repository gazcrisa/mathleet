import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
  Text,
} from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import {BiUser} from "react-icons/bi"
import { auth } from "../../../firebase/clientApp";
import { useRouter } from "next/router";
import { userState } from "../../../atoms/userAtom";
import { useRecoilState } from "recoil";

type UserMenuProps = {
  user: User;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const router = useRouter();
  const [userStateValue, setUserStateValue] = useRecoilState(userState);

  console.log(user)

  const logout = async () => {
    setUserStateValue((prev) => ({
      ...prev,
      savedPosts: [],
    }));
    await signOut(auth);
  };

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius={4}
        _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
      >
        <Flex align="center">
          <Flex align="center">
            <Flex align="center" justify="center">
              <Icon
                mr={1}
                color="#aaaaaa"
                as={BiUser}
                fontSize={{ base: "12pt", sm: "18pt" }}
              />
              <Text ml={1} mr={1} color="#aaaaaa" fontSize="10pt" display={{base: "none", md: "flex"}}>
                {user.displayName}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon color="#aaaaaa" fontSize={20} />
        </Flex>
      </MenuButton>
      <MenuList bg="#1c1c1c" border="0.5px solid #444">
        <>
          <MenuItem
            color="#aaaaaa"
            bg="#1c1c1c"
            fontSize="12pt"
            fontWeight={700}
            _hover={{
              bg: "rgba(102,122,128,0.10196078431372549)",
              color: "white",
            }}
            onClick={() => {
              router.push(`/user/${user.uid}`);
            }}
          >
            <Flex align="center">
              <Icon fontSize={20} mr={2} as={CgProfile} />
              My Profile
            </Flex>
          </MenuItem>
          <MenuDivider />
          <MenuItem
            bg="#1c1c1c"
            color="#aaaaaa"
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
      </MenuList>
    </Menu>
  );
};
export default UserMenu;
