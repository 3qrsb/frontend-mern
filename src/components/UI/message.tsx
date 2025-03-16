import React, { ReactNode } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

type MessageProps = {
  children: ReactNode;
  variant?: "error" | "warning" | "info" | "success";
};

const Message: React.FC<MessageProps> = ({ children, variant = "error" }) => {
  return (
    <Alert severity={variant}>
      <AlertTitle>{children}</AlertTitle>
    </Alert>
  );
};

export default Message;
