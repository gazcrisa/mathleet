import { Flex, Icon, Image } from "@chakra-ui/react";
import { FaUserCircle } from "react-icons/fa";

type UserImageBoxProps = {
  selectedFile?: string;
  imageURL?: string;
};

const UserImageBox: React.FC<UserImageBoxProps> = ({
  imageURL,
  selectedFile,
}) => {
  console.log("user image box", imageURL, selectedFile)
  return (
    <Flex
      height="4rem"
      width="4rem"
      borderRadius="4px"
      align="center"
      justify="center"
    >
      {imageURL || selectedFile ? (
        <Image
          key={imageURL}
          src={selectedFile ? selectedFile : imageURL}
          boxSize="100%"
          objectFit="cover"
          borderRadius="full"
          alt="No Image Available"
        />
      ) : (
        <Icon
          color="#333"
          as={FaUserCircle}
          width="100%"
          height="100%"
          padding="4px"
        />
      )}
    </Flex>
  );
};
export default UserImageBox;
