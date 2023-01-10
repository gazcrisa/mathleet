import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";

export const theme = extendTheme({
  colors: {
    brand: {
      100: "#3182CE",
    },
  },
  fonts: {
    body: "Open Sans, sans-serif",
  },
  styles: {
    global: () => ({
      body: {
        bg: "#333",
        bgSoft: ""
      },
    }),
  },
  components: {
    Button
  },
});

// linear-gradient(to right, #F93822, #F9D423)
