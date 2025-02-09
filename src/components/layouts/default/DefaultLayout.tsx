import React, { ReactNode } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import Meta from "../../UI/meta";

interface DefaultLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const DefaultLayout = ({
  title = "",
  description = "",
  children,
}: DefaultLayoutProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Meta title={title} description={description} />
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Box component="footer">
        <Footer />
      </Box>
    </Box>
  );
};

export default DefaultLayout;
