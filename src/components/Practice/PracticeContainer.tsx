import {
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ProblemType } from "../../enums/problems";
import Problem from "./Problem";
import { VscDebugRestart } from "react-icons/vsc";

type PracticeContainerProps = {
  problemType: ProblemType;
};

const PracticeContainer: React.FC<PracticeContainerProps> = ({
  problemType,
}) => {
  const [size, setSize] = useState(10);
  const [includeNegatives, setIncludesNegatives] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getTitle = (type: ProblemType) => {
    switch (type) {
      case ProblemType.PROBABILITY:
        return "Probability";
      case ProblemType.ADD_SUBTRACT:
        return "Addition & Subtraction";
      case ProblemType.PERCENTAGES:
        return "Percentages";
      case ProblemType.MULTIPLY_DIVIDE:
        return "Multiplication & Division";
      default:
        return "Mashup";
    }
  };

  return (
    <Flex direction="column" bg="#1c1c1c">
      <Flex
        border="none"
        color="#cccccc"
        padding="0px 10px 20px"
        borderRadius="4px"
        _hover={{
          borderColor: "gray",
          transition: "700ms",
        }}
      >
        <Flex direction="column" width="100%" paddingTop="16px">
          <Stack spacing={6} p="10px">
            <Text fontSize="16pt">Practice {getTitle(problemType)}</Text>
            <Text fontSize="12pt" color="#aaaaaa">
              Configure how the problems will be generated to adjust the
              difficulty level
            </Text>
            <Flex align="center">
              <Stack spacing={6} direction={{ base: "column", md: "row" }}>
                <Text fontSize="12pt">Level:</Text>
                <Button
                  isActive={size === 10}
                  borderColor="#90EE90"
                  color="#90EE90"
                  variant="outline"
                  width="100px"
                  _active={{ bg: "#444" }}
                  onClick={(e) => setSize(10)}
                >
                  Easy
                </Button>
                <Button
                  isActive={size === 100}
                  borderColor="#FFFF00"
                  color="#FFFF00"
                  variant="outline"
                  width="100px"
                  _active={{ bg: "#444" }}
                  onClick={(e) => setSize(100)}
                >
                  Medium
                </Button>
                <Button
                  isActive={size === 1000}
                  borderColor="#FF4500"
                  color="#FF4500"
                  variant="outline"
                  width="100px"
                  _active={{ bg: "#333" }}
                  onClick={(e) => setSize(1000)}
                >
                  Hard
                </Button>
              </Stack>
            </Flex>
            <Stack align="center" direction="row">
              <Text fontSize="12pt" width="150px">
                Include negatives?
              </Text>
              <Switch
                size="md"
                checked={includeNegatives}
                onChange={(event) => setIncludesNegatives(event.target.checked)}
              />
            </Stack>
            <Stack align="center" direction="row">
              <Text fontSize="12pt" width="150px">
                Use mic to answer?
              </Text>
              <Switch size="md" />
            </Stack>
          </Stack>
          <Button height="30px" onClick={onOpen} mt={4}>
            Start
          </Button>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent bg="#1c1c1c" color="white">
            <ModalCloseButton />
            <ModalBody>
              <Problem
                digitLength={size}
                includeNegatives={includeNegatives}
                type={problemType}
              />
            </ModalBody>

            <ModalFooter>
              <Flex width="100%" justify="center" ml={6} mr={6}>
                <IconButton
                  variant="outline"
                  aria-label="Call Sage"
                  fontSize="18px"
                  icon={<VscDebugRestart />}
                ></IconButton>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Flex>
  );
};
export default PracticeContainer;
