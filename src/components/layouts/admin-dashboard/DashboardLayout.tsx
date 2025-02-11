import React from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout: React.FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Fixed top header */}
      <Header />
      {/* Collapsible sidebar */}
      <Sidebar />
      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px", // leave space for the header (AppBar height)
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
