import {
  Badge,
  Button,
  Flex,
  Icon,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import CountDown from "./CountDown";
import { Problem } from "../../types/problem";
import { ProblemType } from "../../enums/problems";
import Timer from "./Timer";
import { generateProblems } from "./generateProblems";
import { BsCoin } from "react-icons/bs";

type ProblemProps = {
  digitLength: number;
  includeNegatives: boolean;
  type: ProblemType;
};

const Problem: React.FC<ProblemProps> = ({
  digitLength,
  includeNegatives,
  type,
}) => {
  const [showProblem, setShowProblem] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleShowProblems = () => {
    // setProblems(generateProblems(digitLength, includeNegatives, type));
    setShowProblem(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userAnswer = +e.target.value;
    console.log("expected answer", problems[index].answer);

    if (userAnswer === problems[index].answer) {
      setIndex((prev) => prev + 1);
      setScore((prev) => prev + 1);
      e.target.value = "";
    }
  };

  const handleDone = () => {
    setShowProblem(false);
    setIsFinished(true);
  };

  const onSave = () => {
    // if (!user) {
    //   setAuthModalState({ open: true, view: "login" });
    //   return;
    // }
  };

  useEffect(() => {
    setProblems(generateProblems(digitLength, includeNegatives, type));
  }, []);

  return (
    <Flex
      bg="#111"
      direction="column"
      height="300px"
      align="center"
      justify="center"
      color="white"
      fontSize="24px"
      fontWeight={700}
      ml={6}
      mr={6}
      mt={6}
    >
      <Flex width="100%" padding={6} justifyContent="space-between">
        <Text color="#777" fontSize="18px">
          score: {score}
        </Text>
        <Timer isRunning={showProblem} handleDone={handleDone} />
      </Flex>
      <Flex
        height="70%"
        direction="column"
        justifyContent="space-between"
        align="center"
        padding={"24px 0px"}
      >
        <CountDown handleShowProblems={handleShowProblems} />
        {showProblem && <Text fontSize="40px">{problems[index].text}</Text>}
        {showProblem && (
          <Input
            borderColor="#3182CE"
            placeholder="Type your answer"
            disabled={!showProblem}
            onChange={handleChange}
          />
        )}
        {isFinished && (
          <Stack spacing={6}>
            <Text fontSize="20px">
              Your Score: {score} answered in 2 minutes
            </Text>
            <Flex justifyContent="center">
              <Button colorScheme="blue" mr={3} onClick={onSave}>
                Save Score
              </Button>
            </Flex>
          </Stack>
        )}
      </Flex>
    </Flex>
  );
};
export default Problem;
