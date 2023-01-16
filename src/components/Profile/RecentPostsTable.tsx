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
import React from "react";
import { Post } from "../../types";
import Header from "../Header/Header";

type RecentPostsTableProps = {
  recentPosts: Post[];
};

const RecentPostsTable: React.FC<RecentPostsTableProps> = ({ recentPosts }) => {
  return (
    <Flex bg="#1c1c1c" direction="column">
      <Header title="Recent Posts" />
      <Table
        color="#aaaaaa"
        variant="simple"
        fontWeight={600}
        colorScheme="whiteAlpha"
        fontSize="14px"
      >
        {!recentPosts.length && (
          <TableCaption color="gray.600">
            No posts have been written yet
          </TableCaption>
        )}
        <Tbody>
          {recentPosts.map((p: Post, index: number) => {
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
                    {p.title}
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot />
      </Table>
    </Flex>
  );
};
export default RecentPostsTable;
