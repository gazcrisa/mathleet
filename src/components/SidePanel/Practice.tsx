import { Flex, Icon, Stack, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { TbMath } from "react-icons/tb";
import { ProblemType } from "../../enums/problems";
import { getShortTitle } from "../../util";

type PracticeProps = {};

const Practice: React.FC<PracticeProps> = () => {
  const router = useRouter();

  const handleSelection = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    problemType: ProblemType
  ) => {
    event.stopPropagation();
    router.push(`/practice/${problemType}`);
  };

  const problemTypes = Object.values(ProblemType);

  return (
    <Flex
      direction="column"
      bg="#1c1c1c"
      borderRadius={4}
      border="none"
      position="sticky"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="34px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        backgroundSize="cover"
      ></Flex>
      <Flex direction="column" p="12px">
        <Flex align="center" mb={2}>
          <Icon as={TbMath} fontSize={50} color="brand.100" mr={2} />
          <Text fontWeight={600} color="white">
            Challenges
          </Text>
        </Flex>
        <Stack spacing={3}>
          <Text fontSize="9pt" color="#cccccc">
            Boost your mental math skills with daily practice.
          </Text>
          {problemTypes.map((type) => {
            return (
              <Button
                key={type}
                variant="outline"
                height="30px"
                onClick={(e) => {
                  handleSelection(e, type);
                }}
              >
                {getShortTitle(type)}
              </Button>
            );
          })}
        </Stack>
      </Flex>
    </Flex>
  );
};
export default Practice;
