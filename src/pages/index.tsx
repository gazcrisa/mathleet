import PageContent from "../components/Layout/PageContent";
import CreatePostLink from "../components/Posts/CreatePostLink";
import Posts from "../components/Posts/Posts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import EmailVerificationAlert from "../components/Alerts/EmailVerificationAlert";
import { useEffect, useRef, useState } from "react";
import EmailVerificationResend from "../components/Alerts/EmailVerificationResend";
import SidePanel from "../components/SidePanel/SidePanel";
import { Box, Flex, Text } from "@chakra-ui/react";
import TopSlider from "../components/TopSlider/TopSlider";

export default function Home() {
  const [user] = useAuthState(auth);
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [width, setWidth] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      // clear warnings when user logs out
      setShowEmailWarning(false);
      setShowSuccess(false);
      return;
    }
    setShowEmailWarning(!user.emailVerified);
  }, [user]);

  useEffect(() => {
    const ref = carousel.current
    if (ref) {
      setWidth(ref.scrollWidth - ref.offsetWidth)
    }
  }, [carousel])

  const handleResend = (success: boolean) => {
    if (success) {
      setShowEmailWarning(false);
      setShowSuccess(true);
    }
  };

  return (
    <PageContent>
      <>
        {showEmailWarning && (
          <EmailVerificationAlert
            handleResend={handleResend}
            setShowEmailWarning={setShowEmailWarning}
          />
        )}
        <Flex
          ref={carousel}
          width="100%"
          p={2}
          cursor="grab"
          overflow="hidden"
          display={{ md: "none" }}
          mb={1}
        >
          <TopSlider width={width}/>
        </Flex>
        {showSuccess && <EmailVerificationResend />}
        {user && <CreatePostLink />}
        <Posts />
      </>
      <>
        <SidePanel />
      </>
    </PageContent>
  );
}
