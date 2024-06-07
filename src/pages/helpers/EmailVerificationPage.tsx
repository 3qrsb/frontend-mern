import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import DefaultLayout from "../../components/layouts/default-layout";

const EmailVerificationPage = () => {
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const query = new URLSearchParams(location.search);
      const token = query.get("token");

      if (token) {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/verify/verify-email?token=${token}`
          );
          setMessage(response.data.message);
        } catch (error) {
          setMessage(
            "Email verification failed. The token may be invalid or expired."
          );
        }
      } else {
        setMessage("Invalid verification link.");
      }
    };

    verifyEmail();
  }, [location]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Typography variant="h4" gutterBottom>
        Email Verification
      </Typography>
      <Typography variant="body1" gutterBottom>
        {message}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        You may close this page.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.close()}
        sx={{ marginTop: "20px" }}
      >
        Close
      </Button>
    </Box>
  );
};

export default EmailVerificationPage;
