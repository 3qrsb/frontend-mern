import React, { useState } from "react";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import axios from "axios";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/forgot-password",
        { email }
      );
      setMessage(response.data.message);
      setError("");
    } catch (err: any) {
      setError(err.response.data.error);
      setMessage("");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            marginTop: 1,
            bgcolor: "background.paper",
            boxShadow: 3,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h5" align="center">
            Forgot Password
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Submit
          </Button>
          {message && (
            <Typography color="primary" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
