import { Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import AuthButtons from "../../Navbar/RightContent/AuthButtons";
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
  return (
    <Flex
      direction="column"
      position="relative"
      mt={8}
      borderBottom="1px"
      borderColor="#444"
      paddingBottom={"20px"}
    >
      {user ? (
        <>
          <Text mb={1} color="rgb(129, 131, 132)">
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
          <Flex
            left="1px"
            bottom="1px"
            justify="flex-end"
            p="6px 8px"
            borderRadius="0px 0px 4px 4px"
          >
            <Button
              height="26px"
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
          p={4}
        >
          <Text fontWeight={600} fontSize="14pt" color="gray.300" mr={4}>
            Log in or sign up to leave a comment
          </Text>
          <AuthButtons />
        </Flex>
      )}
    </Flex>
  );
};
export default CommentInput;
