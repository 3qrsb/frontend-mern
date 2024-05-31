import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DefaultLayout from "../components/layouts/default-layout";

const EmailVerificationPage: React.FC = () => {
  const [message, setMessage] = useState<string>("");
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
    <DefaultLayout>
      <div>
        <h1>Email Verification</h1>
        <p>{message}</p>
      </div>
    </DefaultLayout>
  );
};

export default EmailVerificationPage;
