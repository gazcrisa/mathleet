import { Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type CountDownProps = {
  handleShowProblems: () => void;
};

const CountDown: React.FC<CountDownProps> = ({ handleShowProblems }) => {
  const [count, setCount] = useState(3);

  console.log("in countdown");

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCount((count) => {
        if (count === 1) {
          clearInterval(countdownInterval);
        }
        return count - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  useEffect(() => {
    if (count == 0) {
      handleShowProblems();
    }
  }, [count]);

  return <Text fontSize="36px">Starting in {count}</Text>;
};
export default CountDown;
