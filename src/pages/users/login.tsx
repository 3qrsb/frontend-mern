import React, { useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Link,
  Fade,
  Stack,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux";
import { userLogin } from "../../redux/users/login-slice";
import DefaultLayout from "../../components/layouts/default/DefaultLayout";
import FormTextField from "../../components/FormTextField";

type FormValues = {
  email: string;
  password: string;
};

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Minimum 6 characters")
    .max(40, "Maximum 40 characters"),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userInfo } = useAppSelector((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await dispatch(userLogin(data)).unwrap();
      } catch {}
    },
    [dispatch]
  );

  useEffect(() => {
    if (userInfo?.accessToken) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  return (
    <DefaultLayout>
      <Container
        maxWidth="sm"
        sx={{ display: "flex", alignItems: "center", minHeight: "100vh", p: 2 }}
      >
        <Fade in timeout={1000}>
          <Paper elevation={4} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Sign in to continue
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
              </Stack>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Link href="/forgot-password" variant="body2">
                  Forgot Password?
                </Link>
                <Link href="/register" variant="body2">
                  Create Account
                </Link>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </DefaultLayout>
  );
};

export default Login;
