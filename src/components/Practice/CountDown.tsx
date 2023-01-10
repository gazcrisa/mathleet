import { Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type CountDownProps = {
  handleShowProblems: () => void;
};

const CountDown: React.FC<CountDownProps> = ({ handleShowProblems }) => {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(3);
  const [text, setText] = useState("Starting in ");
  const [showCount, setShowCount] = useState(true);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCount((count) => {
        if (count === 1) {
          setText("Start!");
          setShowCount(false);
        } else if (count === 0) {
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
      setShow(false);
      handleShowProblems();
    }
  }, [count, show]);

  return (
    <>
      {show && (
        <Flex align="center" justifyContent="center">
          <Text mr={1}>{text}</Text>
          {showCount && <Text>{count}</Text>}
        </Flex>
      )}
    </>
  );
};
export default CountDown;
