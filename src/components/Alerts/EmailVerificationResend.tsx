import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
  Flex,
} from "@chakra-ui/react";
import React, { useState } from "react";

const EmailVerificationResend: React.FC = () => {
  const [show, setShow] = useState(true);

  return show ? (
    <Alert status="info" mb={4} justifyContent="space-evenly">
      <AlertIcon />
      <Flex align="center">
        <AlertTitle>Resent email verification</AlertTitle>
        <AlertDescription>
          Please check your inbox to verify your account
        </AlertDescription>
        <CloseButton
        onClick={() => {
          setShow(false);
        }}
      />
      </Flex>
    </Alert>
  ) : (
    <></>
  );
};
export default EmailVerificationResend;
