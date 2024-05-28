import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../components/layouts/default-layout";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <DefaultLayout title="Payment Cancelled">
      <Container className="text-center my-5 cancel-container">
        <img
          src="../public/images/c.webp"
          alt="Payment Cancelled"
          className="cancel-image"
        />
        <h1 className="cancel-heading">Payment Cancelled</h1>
        <p className="cancel-text">
          Your payment was not successful. Please try again.
        </p>
        <Button
          onClick={() => navigate("/cart")}
          variant="danger"
          className="cancel-button"
        >
          Go to Cart
        </Button>
      </Container>
    </DefaultLayout>
  );
};

export default Cancel;
