import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Box,
  CloseButton,
  Spinner,
} from "@chakra-ui/react";
import { useSendEmailVerification } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";

type EmailVerificationAlertProps = {
  handleResend: (state: boolean) => void;
  setShowEmailWarning: (state: boolean) => void;
};

const EmailVerificationAlert: React.FC<EmailVerificationAlertProps> = ({
  handleResend,
  setShowEmailWarning,
}) => {
  const [sendEmailVerification, sending, error] =
    useSendEmailVerification(auth);

  const onResend = async () => {
    const success = await sendEmailVerification();
    handleResend(success);
  };

  return (
    <Alert status="warning" mb={4}>
      <AlertIcon />
      <Box>
        <AlertTitle textAlign="center">
          Your account has NOT been verified!
        </AlertTitle>
        <AlertDescription>
          You won't be able to write posts or leave comments until your account
          is verified.
        </AlertDescription>
        {sending ? (
          <Spinner />
        ) : (
          <Text
            ml={2}
            textAlign="center"
            cursor="pointer"
            color="brand.100"
            fontWeight={600}
            onClick={onResend}
            _hover={{ bg: "rgba(102,122,128,0.10196078431372549)" }}
          >
            Resend verification email
          </Text>
        )}
        {error && (
          <Text color="red" textAlign="center" fontSize="10pt">
            An error occured while attempting to resend verification email.
            Please wait a few minutes and then retry.
          </Text>
        )}
      </Box>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={() => {
          setShowEmailWarning(false);
        }}
      />
    </Alert>
  );
};
export default EmailVerificationAlert;
