import { Button, Flex, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import TextEditor from "../../TextEditor/TextEditor";

type CommentInputProps = {
  commentText: string;
  setCommentText: (value: string) => void;
  user: User;
  createLoading: boolean;
  onCreateComment: (commentText: string) => void;
};

const CommentInput: React.FC<CommentInputProps> = ({
  user,
  commentText,
  setCommentText,
  createLoading,
  onCreateComment,
}) => {
  const setAuthModalState = useSetRecoilState(authModalState);

  return (
    <Flex
      direction="column"
      position="relative"
      paddingBottom={"20px"}
      width="100%"
    >
      {user ? (
        <>
          <Text mb={1} color="rgb(129, 131, 132)" fontSize="10pt">
            Commenting as
            <span style={{ color: "#3182CE", marginLeft: "5px" }}>
              {user?.email?.split("@")[0]}
            </span>
          </Text>
          <TextEditor
            value={commentText}
            onChange={setCommentText}
            placeholder={"What's your response?"}
          />
          <Flex justify="flex-end">
            <Button
              height={{ base: "16px", sm: "20px" }}
              fontSize={{ base: "10pt", sm: "12pt" }}
              padding={{ base: 3, sm: 4 }}
              mt={4}
              disabled={!commentText.length}
              isLoading={createLoading}
              onClick={() => onCreateComment(commentText)}
            >
              Comment
            </Button>
          </Flex>
        </>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor="#444"
          p={{ base: 3, sm: 4 }}
        >
          <Text
            fontSize={{ base: "10pt", sm: "14pt" }}
            color="#3182CE"
            onClick={() => setAuthModalState({ open: true, view: "login" })}
            cursor="pointer"
          >
            Log in or sign up to leave a comment
          </Text>
        </Flex>
      )}
    </Flex>
  );
};
export default CommentInput;
