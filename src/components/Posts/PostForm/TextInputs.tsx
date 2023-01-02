import { Button, Flex, Input, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
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

  const router = useRouter();
  
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
        <Stack direction="row" spacing={2}>
          <Button
            variant="outline"
            height="34px"
            padding="0px 25px"
            onClick={() => router.push(`/`)}
          >
            Cancel
          </Button>
          <Button
            height="34px"
            padding="0px 30px"
            disabled={!textInputs.title}
            isLoading={loading}
            onClick={handleCreatePost}
          >
            Post
          </Button>
        </Stack>
      </Flex>
    </Flex>
  );
};
export default TextInputs;
