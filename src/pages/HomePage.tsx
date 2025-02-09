import React from "react";
import { Button, Box, Typography, InputBase, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import BrandsMarquee from "../components/BrandsMarquee";
import FAQSection from "../components/sections/FAQSection";
import DefaultLayout from "../components/layouts/default/DefaultLayout";

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
}));

export default function LandingPage() {
  return (
    <DefaultLayout>
      <Box>
        {/* Hero Section */}
        <Box
          sx={{
            position: "relative",
            py: { xs: 12, sm: 16, lg: 20 },
            backgroundColor: "white",
            overflow: "hidden",
          }}
        >
          {/* Background Image */}
          <Box
            component="img"
            src="/images/bg4.jpg"
            alt=""
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: { xs: "center", lg: "center" },
            }}
          />
          {/* Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: alpha("#111827", 0.4),
            }}
          />
          {/* Content */}
          <Box
            sx={{
              position: "relative",
              px: { xs: 4, sm: 6, lg: 8 },
              maxWidth: "1200px",
              margin: "0 auto",
              textAlign: "center",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: "bold", color: "white", mb: 2 }}
            >
              Experience Tomorrow’s Technology Today
            </Typography>
            <Typography
              variant="body1"
              sx={{ maxWidth: 600, mx: "auto", color: "grey.300", mb: 4 }}
            >
              From powerful smartphones to high-fidelity audio and beyond, our
              collection of premium gadgets is designed to fuel your passion for
              innovation.
            </Typography>

            {/* Search Form */}
            <Box component="form" sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  mb: 2,
                }}
              >
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Try Desk, Chair, Webcam etc..."
                  inputProps={{ "aria-label": "search" }}
                />
              </Paper>
              <Button
                variant="contained"
                fullWidth
                sx={{ py: 2, fontWeight: "bold", textTransform: "uppercase" }}
              >
                Search now
              </Button>
            </Box>

            {/* Statistics */}
            <Grid
              container
              spacing={4}
              justifyContent="center"
              sx={{ mt: { xs: 4, md: 8 } }}
            >
              <Grid size={{ xs: 6, sm: 8 }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  38,942
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "grey.300" }}>
                  Order Delivered
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  14,344
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "grey.300" }}>
                  Registered Customers
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <BrandsMarquee />
        <FAQSection />
      </Box>
    </DefaultLayout>
  );
}
