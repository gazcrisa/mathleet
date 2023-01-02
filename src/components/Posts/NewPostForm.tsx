import { Alert, AlertIcon, Flex, Icon, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoDocumentText } from "react-icons/io5";
import TextInputs from "./PostForm/TextInputs";
import TabItem from "./PostTabItem";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../../firebase/clientApp";

type NewPostFormProps = {
  user: User;
};

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCreatePost = async () => {
    // create new post obect => type Post
    setLoading(true);
    try {
      // write the new post to the db
      await addDoc(collection(firestore, "posts"), {
        creatorId: user.uid,
        creatorDisplayName: user.displayName ? user.displayName : 'Anonymous',
        title:
          textInputs.title.charAt(0).toUpperCase() + textInputs.title.slice(1),
        body: textInputs.body,
        numComments: 0,
        likes: [],
        createdAt: serverTimestamp() as Timestamp,
      });

      // redirect the user back to the home page using the router
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
    <Flex direction="column" bg="#1c1c1c" borderRadius={4} mt={{base: "0", sm: "4"}}>
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
