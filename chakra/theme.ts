import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";

// export const theme = extendTheme({
//   colors: {
//     brand: {
//       100: "#FF3C00",
//     },
//   },
//   fonts: {
//     body: "Open Sans, sans-serif",
//   },
//   styles: {
//     global: () => ({
//       body: {
//         bg: "gray.200",
//       },
//     }),
//   },
//   components: {
//     Button
//   },
// });

// const myTheme = {
//   ...theme,
//   colors: {
//     ...theme.colors,
//     dark: '#1a202c',
//     mediumDark: '#2d3748',
//     mediumLight: '#4a5568',
//     light: '#a0aec0',
//     veryLight: '#cbd5e0',
//     white: '#fff',
//   },
// }

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
