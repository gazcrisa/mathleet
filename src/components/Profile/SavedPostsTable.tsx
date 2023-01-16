import {
  Flex,
  Table,
  TableCaption,
  Tbody,
  Tr,
  Td,
  Button,
  Tfoot,
} from "@chakra-ui/react";
import router from "next/router";
import { useEffect } from "react";
import useUser from "../../hooks/useUser";
import { SavedPost } from "../../types/user";
import Header from "../Header/Header";

type SavedPostsTableProps = {
  uid: string;
};

const SavedPostsTable: React.FC<SavedPostsTableProps> = ({ uid }) => {
  const { userStateValue, getSavedPosts } = useUser();

  useEffect(() => {
    getSavedPosts(uid);
  }, []);

  return (
    <Flex bg="#1c1c1c" direction="column">
      <Header title="Saved Posts" />
      <Table
        color="#aaaaaa"
        variant="simple"
        fontWeight={600}
        colorScheme="whiteAlpha"
        fontSize="14px"
      >
        {!userStateValue.savedPosts?.length ? (
          <TableCaption color="gray.600">
            No posts have been saved yet
          </TableCaption>
        ) : (
          <Tbody>
            {userStateValue.savedPosts.map((p: SavedPost, index: number) => {
              return (
                <Tr key={index}>
                  <Td>
                    <Button
                      whiteSpace="normal"
                      textAlign="left"
                      fontSize="14px"
                      p={0}
                      variant="unstyled"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/posts/${p.id}`);
                      }}
                    >
                      {p.postTitle}
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        )}
        <Tfoot />
      </Table>
    </Flex>
  );
};
export default SavedPostsTable;
