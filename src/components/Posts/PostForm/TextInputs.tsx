import { Button, Flex, Input } from "@chakra-ui/react";
import TextEditor from "../../TextEditor/TextEditor";

type TextInputsProps = {
  textInputs: {
    title: string;
    body: string;
  };

  onTitleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBodyChange: (value: string) => void;
  handleCreatePost: () => void;
  loading: boolean;
};

const TextInputs: React.FC<TextInputsProps> = ({
  textInputs,
  onTitleChange,
  onBodyChange,
  handleCreatePost,
  loading,
}) => {
  return (
    <Flex className="input-container" direction="column" gap={3} width="100%">
      <Input
        name="title"
        value={textInputs.title}
        onChange={onTitleChange}
        fontSize="14pt"
        borderRadius={4}
        placeholder="Title"
        border="1px solid"
        borderColor="#444"
        color="gray.300"
        _placeholder={{ color: "gray.300", fontSize: "16px" }}
        _focus={{
          outline: "none",
          color: "gray.300",
        }}
        _hover={{
          border: "1px solid",
          borderColor: "#444",
        }}
      />
      <TextEditor
        value={textInputs.body}
        onChange={onBodyChange}
        placeholder={"Text (Optional)"}
      />
      <Flex justify="flex-end">
        <Button
          height="34px"
          padding="0px 30px"
          disabled={!textInputs.title}
          isLoading={loading}
          onClick={handleCreatePost}
        >
          Post
        </Button>
      </Flex>
    </Flex>
  );
};
export default TextInputs;
