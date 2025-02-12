import React, { useCallback } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Link,
  Divider,
  Fade,
  Stack,
} from "@mui/material";
import { AccountCircle, Email, Lock } from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import publicAxios from "../../utils/public-axios";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import DefaultLayout from "../../components/layouts/default/DefaultLayout";
import { useAppDispatch } from "../../redux";
import FormTextField from "../../components/FormTextField";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const registerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Username is required")
    .min(5, "At least 5 characters")
    .max(20, "Max 20 characters"),
  email: Yup.string().required("Email is required").email("Invalid email"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "At least 6 characters")
    .max(40, "Max 40 characters"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(registerValidationSchema),
  });

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        const res = await publicAxios.post("/users/register", data);
        if (res.data.success) {
          toast.success(
            "Registration successful! Please check your email to confirm your account."
          );
          navigate("/login");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } catch (err: any) {
        toast.error(
          err.response?.data?.message ||
            "An error occurred. Please try again later."
        );
      }
    },
    [navigate]
  );

  const onSuccess = useCallback(
    async (credentialResponse: any) => {
      try {
        const res = await publicAxios.post(
          "/users/google-login",
          credentialResponse
        );
        if (res.data.message === "Email already in use.") {
          toast.error("Email is already in use. Please use a different email.");
        } else {
          toast.success("Login successful!");
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          dispatch({ type: "users/login/fulfilled", payload: res.data });
          navigate("/");
        }
      } catch (err: any) {
        toast.error(
          err.response?.data?.message ||
            "An error occurred. Please try again later."
        );
      }
    },
    [dispatch, navigate]
  );

  return (
    <DefaultLayout>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: "100vh",
          p: 2,
        }}
      >
        <Fade in timeout={1000}>
          <Paper elevation={4} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Sign up to get started
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ mt: 2 }}
            >
              <Stack spacing={2}>
                <FormTextField
                  fullWidth
                  label="Username"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  icon={<AccountCircle />}
                />
                <FormTextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  icon={<Email />}
                />
                <FormTextField
                  fullWidth
                  label="Password"
                  type="password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  icon={<Lock />}
                />
                <FormTextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  icon={<Lock />}
                />
              </Stack>
              <Link
                href="/login"
                variant="body2"
                display="block"
                sx={{ mt: 2, textAlign: "right" }}
              >
                Already have an account? Login
              </Link>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </Box>
            <Divider sx={{ my: 3 }}>or</Divider>
            <Stack spacing={2}>
              <GoogleLogin onSuccess={onSuccess} text="signin_with" />
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GitHubIcon />}
                onClick={() => toast("GitHub authentication coming soon")}
              >
                Sign in with GitHub
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </DefaultLayout>
  );
};

export default Register;
