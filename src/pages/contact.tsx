import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Divider,
  CircularProgress,
  Fade,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MapIcon from "@mui/icons-material/Map";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import DefaultLayout from "../components/layouts/default-layout";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
}));

const Contact = () => {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbarOpen(true);
      setTimeout(() => navigate("/"), 3000);
    }, 2000);
  };

  return (
    <DefaultLayout title="Contact">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={1000}>
          <Box>
            <Typography variant="h3" align="center" gutterBottom>
              Get in Touch
            </Typography>
            <Typography variant="subtitle1" align="center" gutterBottom>
              We would love to hear from you. Fill out the form below to send us
              a message.
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <StyledPaper>
                  <Typography variant="h5" gutterBottom>
                    Contact Information
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" alignItems="center" my={1}>
                    <MapIcon sx={{ fontSize: 30, mr: 2 }} color="primary" />
                    <Box>
                      <Typography variant="subtitle1">Our Address</Typography>
                      <Typography variant="body2">
                        Prospekt Mangilik Yel., Astana 020000
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" my={1}>
                    <EmailIcon sx={{ fontSize: 30, mr: 2 }} color="primary" />
                    <Box>
                      <Typography variant="subtitle1">Email Us</Typography>
                      <Typography variant="body2">
                        support@gmail.com
                        <br />
                        info@example.com
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" my={1}>
                    <PhoneIcon sx={{ fontSize: 30, mr: 2 }} color="primary" />
                    <Box>
                      <Typography variant="subtitle1">Call Us</Typography>
                      <Typography variant="body2">
                        +7 777 777 77 77
                        <br />
                        +7 712 345 67 89
                      </Typography>
                    </Box>
                  </Box>
                </StyledPaper>
              </Grid>

              <Grid item xs={12} md={6}>
                <StyledPaper>
                  <Typography variant="h5" gutterBottom>
                    Send Us a Message
                  </Typography>
                  <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{ mt: 2 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Your Name"
                          fullWidth
                          variant="outlined"
                          {...register("name", {
                            required: "Name is required",
                          })}
                          error={Boolean(errors.name)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Your Email"
                          type="email"
                          fullWidth
                          variant="outlined"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /\S+@\S+\.\S+/,
                              message: "Invalid email address",
                            },
                          })}
                          error={Boolean(errors.email)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Subject"
                          fullWidth
                          variant="outlined"
                          {...register("subject", {
                            required: "Subject is required",
                          })}
                          error={Boolean(errors.subject)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Message"
                          fullWidth
                          multiline
                          rows={4}
                          variant="outlined"
                          {...register("message", {
                            required: "Message is required",
                          })}
                          error={Boolean(errors.message)}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 3 }}
                      disabled={loading}
                      startIcon={loading && <CircularProgress size={20} />}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Box>
                </StyledPaper>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Thanks for your feedback 🙂
        </Alert>
      </Snackbar>
    </DefaultLayout>
  );
};

export default Contact;
