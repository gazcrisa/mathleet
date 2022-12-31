import { Icon } from "@chakra-ui/react";
import React from "react";
import { BsDot } from "react-icons/bs";

const Dot: React.FC = () => {
  return (
    <Icon
      as={BsDot}
      fontSize={{ base: "8pt" }}
      color={false ? "brand.100" : "rgb(129, 131, 132)"}
    />
  );
};
export default Dot;
