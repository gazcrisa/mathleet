import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { User } from "../../types/user";
import UserImageBox from "./UserImageBox";

type EditProfileInputsProps = {
  selectedUser: User;
  loading: boolean;
  handleEditUser: (user: User, selectedFile?: string) => void;
  handleRemovePhoto: (user: User) => void;
};

const EditProfileInputs: React.FC<EditProfileInputsProps> = ({
  selectedUser,
  loading,
  handleEditUser,
  handleRemovePhoto,
}) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [updateUserForm, setUpdateUserForm] = useState<User>(selectedUser);

  const selectedFileRef = useRef<HTMLInputElement>(null);

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateUserForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    handleEditUser(updateUserForm, selectedFile);
  };

  const handleRemove = () => {
    if (selectedFile) {
      setSelectedFile("");
    }

    handleRemovePhoto(selectedUser);
  };

  return (
    <Flex width="100%" direction="column">
      <Flex align="center" justify="center" width="100%">
        <Stack align="center" justify="center">
          <UserImageBox
            selectedFile={selectedFile}
            imageURL={selectedUser.imageURL}
          />
          <input
            ref={selectedFileRef}
            type="file"
            hidden
            onChange={onSelectImage}
          />
          <Stack direction="row" spacing={2} align="center" justify="center">
            <Button
              height="30px"
              variant="link"
              onClick={() => selectedFileRef.current?.click()}
            >
              Upload Photo
            </Button>
            {(selectedUser.imageURL || selectedFile) && (
              <>
                <Divider orientation="vertical" color="gray" height="18px" />
                <Button height="30px" variant="link" onClick={handleRemove}>
                  Remove Photo
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Flex>
      <Flex p={6}>
        <FormControl color="#aaaaaa" onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Flex direction="column">
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="displayName"
                width="100%"
                variant="flushed"
                maxLength={32}
                borderColor="#aaaaaa"
                placeholder={selectedUser.displayName}
                _placeholder={{ color: "#cbd5e0" }}
                onChange={handleChange}
              />
            </Flex>
            <Flex direction="column">
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                name="email"
                width="100%"
                variant="flushed"
                maxLength={254}
                color="#cbd5e0"
                borderColor="#aaaaaa"
                placeholder={selectedUser.email}
                _placeholder={{ color: "#cbd5e0" }}
                onChange={handleChange}
              />
            </Flex>
            <Flex direction="column">
              <FormLabel>Bio</FormLabel>
              <Input
                type="text"
                name="bio"
                width="100%"
                variant="flushed"
                color="#cbd5e0"
                maxLength={140}
                borderColor="#aaaaaa"
                placeholder={selectedUser.bio}
                _placeholder={{ color: "#cbd5e0" }}
                onChange={handleChange}
              />
            </Flex>
            <Flex direction="column">
              <FormLabel>School</FormLabel>
              <Input
                type="text"
                name="school"
                width="100%"
                variant="flushed"
                color="#cbd5e0"
                maxLength={64}
                borderColor="#aaaaaa"
                placeholder={selectedUser.school}
                _placeholder={{ color: "#cbd5e0" }}
                onChange={handleChange}
              />
            </Flex>
            <Flex direction="column">
              <FormLabel>Company</FormLabel>
              <Input
                type="text"
                name="company"
                width="100%"
                maxLength={64}
                variant="flushed"
                color="#cbd5e0"
                borderColor="#aaaaaa"
                placeholder={selectedUser.company}
                _placeholder={{ color: "#cbd5e0" }}
                onChange={handleChange}
              />
            </Flex>
            <Flex justify="flex-end">
              <Button
                height="30px"
                type="submit"
                onClick={handleSubmit}
                mt={3}
                isLoading={loading}
              >
                Save
              </Button>
            </Flex>
          </Stack>
        </FormControl>
      </Flex>
    </Flex>
  );
};
export default EditProfileInputs;
