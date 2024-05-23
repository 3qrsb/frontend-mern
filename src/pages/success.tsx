import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../components/layouts/default-layout";

const Success = () => {
  const navigate = useNavigate();

  return (
    <DefaultLayout title="Payment Successful">
      <Container className="text-center my-5">
        <h1>Payment Successful!</h1>
        <p>
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <Button onClick={() => navigate("/")} variant="primary">
          Go to Home
        </Button>
      </Container>
    </DefaultLayout>
  );
};

export default Success;
