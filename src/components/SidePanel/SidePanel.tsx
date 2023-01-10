import { Stack } from "@chakra-ui/react";
import React from "react";
import About from "./About";
import Practice from "./Practice";

type SidePanelProps = {};

const SidePanel: React.FC<SidePanelProps> = () => {
  return (
    <Stack spacing={3}>
      <About />
      <Practice />
    </Stack>
  );
};
export default SidePanel;
