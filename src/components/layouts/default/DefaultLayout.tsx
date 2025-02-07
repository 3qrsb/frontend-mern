import React, { ReactNode } from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Carousels from "../../Carousels";
import Brands from "../../BrandsMarquee";
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
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Meta title={title} description={description} />
      <Header />
      {isHome && <Carousels />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      {isHome && <Brands />}
      <Box component="footer">
        <Footer />
      </Box>
    </Box>
  );
};

export default DefaultLayout;
