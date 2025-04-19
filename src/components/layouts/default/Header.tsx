import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { reset } from "../../../redux/cart/cart-slice";
import { userLogout } from "../../../redux/users/login-slice";

const Header: React.FC = () => {
  const { userInfo } = useAppSelector((state) => state.login);
  const { cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const totalCartQuantity = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  const onLogout = () => {
    dispatch(userLogout());
    dispatch(reset());
    navigate("/login");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "Contact", path: "/contact" },
    { label: "About", path: "/about" },
  ];

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={3}>
        <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
          <Box display="flex" alignItems="center">
            {isMobile && (
              <IconButton
                edge="start"
                onClick={toggleDrawer(true)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                ml: isMobile ? 1 : 0,
              }}
            >
              <Box
                component="img"
                src="https://cdn.simpleicons.org/dji"
                alt="Logo"
                sx={{ height: 32, mr: 2 }}
              />
            </Box>
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 2 }}>
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    component={NavLink}
                    to={link.path}
                    color="inherit"
                    sx={{ textTransform: "none" }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            )}
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              data-testid="cart-badge"
              component={Link}
              to="/cart"
              color="inherit"
            >
              <Badge badgeContent={totalCartQuantity} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            {userInfo && (
              <IconButton component={Link} to="/wishlist" color="inherit">
                <FavoriteIcon />
              </IconButton>
            )}
            {!userInfo ? (
              <>
                <Button
                  component={NavLink}
                  to="/login"
                  variant="outlined"
                  sx={{ ml: 1 }}
                >
                  Login
                </Button>
                <Button
                  component={NavLink}
                  to="/register"
                  variant="contained"
                  sx={{ ml: 1 }}
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                <IconButton onClick={handleMenuOpen} color="inherit">
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  {(userInfo.isAdmin || userInfo.isSeller) && (
                    <MenuItem
                      component={NavLink}
                      to={
                        userInfo.isAdmin
                          ? "/dashboard"
                          : "/dashboard/product-list"
                      }
                      onClick={handleMenuClose}
                    >
                      <DashboardIcon sx={{ mr: 1 }} />
                      Dashboard
                    </MenuItem>
                  )}
                  <MenuItem
                    component={NavLink}
                    to={`/profile/${userInfo._id}`}
                    onClick={handleMenuClose}
                  >
                    <PersonIcon sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      onLogout();
                    }}
                  >
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton component={NavLink} to={link.path}>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
