import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  ModalHeader,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../../atoms/userAtom";
import { firestore, storage } from "../../firebase/clientApp";
import { User } from "../../types/user";
import { hashCode } from "../../util";
import EditProfileInputs from "./EditProfileInputs";
import { v4 as uuidv4 } from "uuid";

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: User;
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  selectedUser,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [userStateValue, setUserStateValue] = useRecoilState(userState);

  const handleEditUser = async (updatedUser: User, selectedFile?: string) => {
    setLoading(true);
    try {
      const userDocRef = doc(firestore, "users", updatedUser.uid);

      await updateDoc(userDocRef, updatedUser);
      let downloadURL;

      if (selectedFile) {
        const imageID = uuidv4();
        const imageRef = ref(
          storage,
          `users/${userDocRef.id}/profileImage-${imageID}`
        );
        await uploadString(imageRef, selectedFile, "data_url");
        downloadURL = await getDownloadURL(imageRef);

        await updateDoc(userDocRef, {
          imageURL: downloadURL,
        });
      }

      if (downloadURL) {
        updatedUser = { ...updatedUser, imageURL: downloadURL };
      }

      setUserStateValue((prev) => ({
        ...prev,
        selectedUser: updatedUser,
      }));
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
    onClose();
  };

  const handleRemovePhoto = async (updatedUser: User) => {
    if (updatedUser.imageURL) {
      const imageRef = ref(storage, updatedUser.imageURL);
      await deleteObject(imageRef);

      updatedUser = { ...updatedUser, imageURL: "" };

      const userDocRef = doc(firestore, "users", updatedUser.uid);
      await updateDoc(userDocRef, updatedUser);

      setUserStateValue((prev) => ({
        ...prev,
        selectedUser: updatedUser,
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="#1c1c1c" color="white">
        <ModalHeader>
          <Text fontWeight={500}>Edit Profile</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditProfileInputs
            selectedUser={selectedUser}
            loading={loading}
            handleEditUser={handleEditUser}
            handleRemovePhoto={handleRemovePhoto}
          />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};
export default EditProfileModal;
