import { Flex, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { Post } from "../../../types";
import TextEditor from "../../TextEditor/TextEditor";

type EditPostInputProps = {
  post: Post;
  setShowEditor: (val: boolean) => void;
  onEdit: (val: string) => void;
  loading: boolean;
};

const EditPostInput: React.FC<EditPostInputProps> = ({
  post,
  onEdit,
  loading,
  setShowEditor,
}) => {
  const [text, setText] = useState(post.body);

  return (
    <Flex direction="column">
      <TextEditor value={text} onChange={setText} placeholder={""} />
      <Flex justify="flex-end" align="center">
        <Button
          variant="outline"
          height="34px"
          mt={4}
          mr={3}
          padding={{ base: 3, sm: 4 }}
          onClick={() => setShowEditor(false)}
        >
          Cancel
        </Button>
        <Button
          height="34px"
          fontSize={{ base: "10pt", sm: "12pt" }}
          padding={{ base: 3, sm: 4 }}
          mt={4}
          isLoading={loading}
          onClick={(e) => onEdit(text)}
        >
          Save
        </Button>
      </Flex>
    </Flex>
  );
};
export default EditPostInput;
