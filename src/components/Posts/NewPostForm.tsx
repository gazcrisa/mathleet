import { Alert, AlertIcon, Flex, Icon, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import TextInputs from "./PostForm/TextInputs";
import ImageUpload from "./PostForm/ImageUpload";
import TabItem from "./PostTabItem";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../../firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useSelectFile from "../../hooks/useSelectFile";

type NewPostFormProps = {
  user: User;
  communityImageURL?: string;
};

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
];

export type TabItem = {
  title: string;
  icon?: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ user }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });

  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCreatePost = async () => {
    // create new post obect => type Post
    setLoading(true);
    try {
      // store the post in db
      const postDocRef = await addDoc(collection(firestore, "posts"), {
        creatorId: user?.uid,
        creatorDisplayName: user.email!.split("@")[0],
        title: textInputs.title,
        body: textInputs.body,
        numberOfComments: 0,
        voteStatus: 0,
        createdAt: serverTimestamp() as Timestamp,
      });

      // check for selectedFile
      if (selectedFile) {
        // store in storage => getDownloadURL (return imageURL)
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        // update post doc by adding imageURL
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
      // redirect the user back to the communityPage using the router
      router.back();
    } catch (error: any) {
      console.log("handleCreatePost error", error.message);
      setError(true);
    }
    setLoading(false);
  };

  const onTitleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;

    setTextInputs((prev) => ({
      ...prev,
      ["title"]: value,
    }));
  };

  const onBodyChange = (val: string) => {
    setTextInputs((prev) => ({
      ...prev,
      ["body"]: val,
    }));
  };

  return (
    <Flex direction="column" bg="#222" borderRadius={4} mt={4}>
      <Flex width="100%">
        {formTabs.map((item, index) => (
          <TabItem
            key={index}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onTitleChange={onTitleChange}
            onBodyChange={onBodyChange}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectImage={onSelectFile}
            setSelectedTab={setSelectedTab}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text mr={2}>Error creating post</Text>
        </Alert>
      )}
    </Flex>
  );
};
export default NewPostForm;