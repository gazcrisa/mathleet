import About from "../components/About";
import PageContent from "../components/Layout/PageContent";
import CreatePostLink from "../components/Posts/CreatePostLink";
import Posts from "../components/Posts/Posts";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/clientApp";
import EmailVerificationAlert from "../components/Alerts/EmailVerificationAlert";
import { useEffect, useState } from "react";
import EmailVerificationResend from "../components/Alerts/EmailVerificationResend";

export default function Home() {
  const [user] = useAuthState(auth);
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      // clear warnings when user logs out
      setShowEmailWarning(false);
      setShowSuccess(false);
      return;
    };
    setShowEmailWarning(!user.emailVerified);
  }, [user]);

  const handleResend = (success: boolean) => {
    if (success) {
      setShowEmailWarning(false);
      setShowSuccess(true);
    }
  };

  return (
    <PageContent>
      <>
      {console.log("rendered home page, showAlert?", showEmailWarning)}
        {showEmailWarning && (
          <EmailVerificationAlert handleResend={handleResend} setShowEmailWarning={setShowEmailWarning}/>
        )}
        {showSuccess && <EmailVerificationResend/>}
        <CreatePostLink></CreatePostLink>
        <Posts />
      </>
      <>
        <About />
      </>
    </PageContent>
  );
}
