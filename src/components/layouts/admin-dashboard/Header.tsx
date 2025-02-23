import React from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppSelector } from "../../../redux";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
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
            display: "flex",
            alignItems: "center",
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {isMobile && (
            <IconButton
              onClick={onMenuClick}
              sx={{ color: "white", mr: 2 }}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="div"
            color="white"
            sx={{ fontWeight: 500 }}
          >
            {userInfo?.isAdmin ? "Admin Dashboard" : "Seller Dashboard"}
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
