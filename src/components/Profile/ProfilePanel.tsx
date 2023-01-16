import {
  Button,
  Flex,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ANONYMOUS, UNKNOWN } from "../../constants";
import { User } from "../../types/user";
import EditProfileModal from "./EditProfileModal";
import UserImageBox from "./UserImageBox";

type ProfilePanelProps = {
  selectedUser: User;
  isCurrentUser?: boolean;
};

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  selectedUser,
  isCurrentUser,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      direction="column"
      bg="#1c1c1c"
      borderRadius={4}
      border="none"
      position="sticky"
      width="100%"
      padding="18px"
    >
      <Flex direction="column">
        <Stack direction="row" spacing={4} align="center">
          <Flex>
            <UserImageBox imageURL={selectedUser.imageURL} />
          </Flex>
          <Flex direction="column">
            <Text color="white" fontWeight="700">
              {selectedUser.displayName ? selectedUser.displayName : ANONYMOUS}
            </Text>
            <Text color="white" fontSize="12px" mt={1} whiteSpace="nowrap">
              Joined Dec 5th, 2017
            </Text>
          </Flex>
        </Stack>
        <Text mt={6} fontSize="10pt" maxWidth="300px" color="#aaaaaa">
          {selectedUser.bio}
        </Text>
        {isCurrentUser && (
          <Button
            height="30px"
            variant="outline"
            onClick={onOpen}
            mt={6}
            width="100%"
          >
            Edit Profile
          </Button>
        )}
        <Stack mt={8} spacing={4} color="#aaaaaa">
          <Text>
            School: {selectedUser.school ? selectedUser.school : UNKNOWN}
          </Text>
          <Text>
            Company: {selectedUser.company ? selectedUser.company : UNKNOWN}
          </Text>
        </Stack>
        <EditProfileModal
          isOpen={isOpen}
          onClose={onClose}
          selectedUser={selectedUser}
        />
      </Flex>
    </Flex>
  );
};
export default ProfilePanel;
