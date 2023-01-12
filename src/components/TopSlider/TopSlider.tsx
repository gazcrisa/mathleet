import { Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { ProblemType } from "../../enums/problems";
import { getShortTitle } from "../../util";
import { motion } from "framer-motion";
import router, { useRouter } from "next/router";

type TopSliderProps = {
  width: number;
};

const TopSlider: React.FC<TopSliderProps> = ({ width }) => {
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
    <Box
      whiteSpace="nowrap"
      as={motion.div}
      drag="x"
      dragConstraints={{ right: 0, left: -width }}
    >
      {problemTypes.map((type) => {
        return (
          <Button
            key={type}
            padding="6px 12px"
            width="150px"
            ml={1}
            mr={1}
            variant="outline"
            height="40px"
            onClick={(e) => {
              handleSelection(e, type);
            }}
          >
            {getShortTitle(type)}
          </Button>
        );
      })}
    </Box>
  );
};
export default TopSlider;
