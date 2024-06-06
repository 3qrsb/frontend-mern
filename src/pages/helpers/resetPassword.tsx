import React, { useState } from "react";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:4000/api/reset-password",
        {
          token,
          password,
        }
      );
      setMessage(response.data.message);
      setError("");
      navigate("/login");
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
            Reset Password
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="New Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ResetPassword;
