import React from "react";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <CssBaseline />
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          pt: isMobile ? 10 : 8,
          transition: theme.transitions.create("padding", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
