import React from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Link,
  InputAdornment,
  Divider,
} from "@mui/material";
import { AccountCircle, Email, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import publicAxios from "../../utils/public-axios";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import DefaultLayout from "../../components/layouts/default/DefaultLayout";
import { useAppDispatch } from "../../redux"; // Import your redux hook for dispatch

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // Use your redux dispatch hook

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Username is required")
      .min(5, "Username must be at least 5 characters")
      .max(20, "Username must not exceed 20 characters"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Confirm Password does not match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: FormValues) => {
    publicAxios
      .post("/users/register", data)
      .then((res) => {
        if (res.data.success) {
          toast.error("Registration failed. Please try again.");
        } else {
          toast.success(
            "Registration successful! Please check your email to confirm your account."
          );
          navigate("/login");
        }
      })
      .catch((err: any) => {
        console.error(err); // Log the error for debugging purposes
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      });
  };

  const onSuccess = (credentialResponse: any) => {
    console.log("Login successful:", credentialResponse);
    publicAxios
      .post("/users/google-login", credentialResponse)
      .then((res: any) => {
        if (res.data.message === "Email already in use.") {
          toast.error("Email is already in use. Please use a different email.");
        } else {
          toast.success("Login successful!");
          // Save the token and user details to local storage or state
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          // Dispatch the userLogin action to update the state
          dispatch({ type: "users/login/fulfilled", payload: res.data });
          // Redirect to the main page
          navigate("/");
        }
      })
      .catch((err: any) => {
        console.error(err); // Log the error for debugging purposes
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      });
  };

  return (
    <DefaultLayout>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh", p: 2, backgroundColor: "#f5f5f5" }} // Background color for the entire page
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 500, // Increase max width
            p: 4, // Increase padding
            bgcolor: "white", // Background color for the form
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              type="password"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
            <Link
              href="/login"
              variant="body2"
              display="block"
              sx={{ mt: 2, textAlign: "right" }}
            >
              Already have an Account? Login
            </Link>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3 }}
            >
              Register
            </Button>
          </Box>
          <Divider sx={{ my: 3 }}>or</Divider>
          <Box mt={2}>
            <GoogleLogin
              onSuccess={onSuccess}
              onError={() => console.error("Login Failed")}
              text={"signin_with"}
            />
          </Box>
        </Box>
      </Box>
    </DefaultLayout>
  );
};

export default Register;
