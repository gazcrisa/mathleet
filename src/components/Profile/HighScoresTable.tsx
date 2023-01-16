import {
  Flex,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  TableContainer,
} from "@chakra-ui/react";
import React from "react";
import { UserScore } from "../../types/user";
import { getShortTitle } from "../../util";
import Header from "../Header/Header";

type HighScoresTableProps = {
  scores: UserScore[];
};

const HighScoresTable: React.FC<HighScoresTableProps> = ({ scores }) => {
  return (
    <Flex bg="#1c1c1c" direction="column">
      <Header title="Top Scores" bgColor="blue.500" />
      <TableContainer>
      <Table color="#aaaaaa" variant="simple" colorScheme="whiteAlpha">
        {!scores.length && (
          <TableCaption color="gray.600">
            No scores have been recorded yet
          </TableCaption>
        )}
        <Thead>
          <Tr>
            <Th>Score</Th>
            <Th>Level</Th>
            <Th>Category</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {scores.map((s: UserScore, index: number) => {
            return (
              <Tr key={index}>
                <Td>{s.score}</Td>
                <Td>{s.level}</Td>
                <Td>{getShortTitle(s.type)}</Td>
                <Td>
                  {new Date(s.createdAt.toDate()).toLocaleDateString("en-US")}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot />
      </Table>
      </TableContainer>
    </Flex>
  );
};
export default HighScoresTable;
