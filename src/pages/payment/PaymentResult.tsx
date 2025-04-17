import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

export type PaymentStatus = "success" | "cancel";

interface PaymentResultProps {
  status: PaymentStatus;
}

const config = {
  success: {
    title: "Payment Successful",
    message:
      "Thank you for your purchase. Your order has been placed successfully.",
    buttonLabel: "Go to Home",
    nextPath: "/",
    Icon: CheckCircleOutlineIcon,
    iconColor: "success.main",
  },
  cancel: {
    title: "Payment Cancelled",
    message: "Your payment was not successful. Please try again.",
    buttonLabel: "Go to Cart",
    nextPath: "/cart",
    Icon: CancelOutlinedIcon,
    iconColor: "error.main",
  },
} as const;

const PaymentResult: React.FC<PaymentResultProps> = ({ status }) => {
  const navigate = useNavigate();
  const { title, message, buttonLabel, nextPath, Icon, iconColor } =
    config[status];

  return (
    <Container
      maxWidth="sm"
      sx={{
        textAlign: "center",
        py: { xs: 4, md: 8 },
      }}
    >
      <Box sx={{ color: iconColor, mb: 2 }}>
        <Icon sx={{ fontSize: { xs: 48, md: 64 } }} />
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        {message}
      </Typography>

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate(nextPath)}
        sx={{ textTransform: "none" }}
      >
        {buttonLabel}
      </Button>
    </Container>
  );
};

export default PaymentResult;
