import { Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type TimerProps = {
  isRunning: boolean;
  handleDone: () => void;
};

const Timer: React.FC<TimerProps> = ({ isRunning, handleDone }) => {
  const [minutes, setMinutes] = useState(2);
  const [seconds, setSeconds] = useState(0);

  const generateTimeString = () => {
    return seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
  };

  useEffect(() => {
    let interval: any;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prev) => prev - 1);
        } else if (minutes > 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        }
      }, 1000);
    }

    if (minutes == 0 && seconds == 0) {
      handleDone();
    }

    return () => clearInterval(interval);
  }, [seconds, minutes, isRunning]);

  return (
    <Text ml="1" fontSize="18px" color="#777" padding="3px 6px">
      {generateTimeString()}
    </Text>
  );
};
export default Timer;
