import { ChakraProvider } from "@chakra-ui/react";
import moment from "moment";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { theme } from "../../chakra/theme";
import Layout from "../components/Layout/Layout";
import "regenerator-runtime/runtime";
import "../firebase/clientApp";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s",
      s: "Just Now",
      ss: "%ss",
      m: "1m",
      mm: "%dm",
      h: "1h",
      hh: "%dh",
      d: "Yesterday",
      dd: "%dd",
      M: "A month ago",
      MM: "%dM",
      y: "1y",
      yy: "%dY",
    },
  });

  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
