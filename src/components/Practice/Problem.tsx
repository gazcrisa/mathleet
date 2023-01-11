import { Button, Flex, IconButton, Input, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CountDown from "./CountDown";
import { Problem } from "../../types/problem";
import { ProblemType } from "../../enums/problems";
import Timer from "./Timer";
import { generateProblems } from "./generateProblems";
import { VscDebugRestart } from "react-icons/vsc";

type ProblemProps = {
  size: number;
  hasNegatives: boolean;
  type: ProblemType;
};

const Problem: React.FC<ProblemProps> = ({ size, hasNegatives, type }) => {
  const [showProblem, setShowProblem] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showCountDown, setShowCountDown] = useState(true);

  const handleShowProblems = () => {
    setShowCountDown(false);
    setShowProblem(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userAnswer = +e.target.value;

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
    setProblems(generateProblems(size, hasNegatives, type));
  }, []);

  const handleRestart = () => {
    setShowProblem(false);
    setShowCountDown(true);
    setIsFinished(false);
    setScore(0);
  };

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
        align="center"
        pt="10px"
        justifyContent="space-between"
      >
        {showCountDown && <CountDown handleShowProblems={handleShowProblems} />}
        {showProblem && (
          <>
            <Text fontSize="40px">{problems[index].text}</Text>
            <Input
              borderColor="#3182CE"
              placeholder="Type your answer"
              disabled={!showProblem}
              onChange={handleChange}
            />
          </>
        )}

        {isFinished && !showProblem && (
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
      <Flex
        width="100%"
        color="#777"
        padding={6}
        justifyContent="flex-end"
        align="center"
      >
        <IconButton
          disabled={showCountDown}
          size="sm"
          variant="outline"
          colorScheme="teal"
          aria-label="Call Sage"
          fontSize="16px"
          icon={<VscDebugRestart />}
          onClick={handleRestart}
        />
      </Flex>
    </Flex>
  );
};
export default Problem;
