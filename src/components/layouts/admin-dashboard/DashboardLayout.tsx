import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <CssBaseline />
      <Header onMenuClick={handleMobileToggle} />
      <Sidebar
        mobileOpen={mobileOpen}
        handleMobileToggle={handleMobileToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          mt: { xs: 3, sm: 4 },
          overflowX: "hidden",
          position: "relative",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
