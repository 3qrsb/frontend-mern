import React from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAppSelector } from "../../../redux";

const Header: React.FC = () => {
  const { userInfo } = useAppSelector((state) => state.login);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#1b1b1b",
        boxShadow: 3,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          <Box>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="div"
              color="white"
              sx={{ fontWeight: 500 }}
            >
              {userInfo?.isAdmin ? "Admin Dashboard" : "Seller Dashboard"}
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
