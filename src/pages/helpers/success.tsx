import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../components/layouts/default-layout";

const Success = () => {
  const navigate = useNavigate();

  return (
    <DefaultLayout title="Payment Successful">
      <Container className="text-center my-5 success-container">
        <img
          src="../public/images/1.png"
          alt="Payment Successful"
          className="success-image"
        />
        <h1 className="success-heading">Payment Successful!</h1>
        <p className="success-text">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <Button
          onClick={() => navigate("/")}
          variant="primary"
          className="success-button"
        >
          Go to Home
        </Button>
      </Container>
    </DefaultLayout>
  );
};

export default Success;
