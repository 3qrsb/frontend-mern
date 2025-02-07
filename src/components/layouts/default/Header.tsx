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
  InputBase,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const onLogout = () => {
    dispatch(userLogout());
    dispatch(reset());
    navigate("/login");
  };

  const totalCartQuantity = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchIconClick = () => {
    setSearchOpen((prev) => !prev);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSearchOpen(false);
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={3}>
      <Toolbar sx={{ justifyContent: "space-between", px: theme.spacing(2) }}>
        <Box display="flex" alignItems="center">
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src="/src/file.png"
              alt="Logo"
              sx={{ height: 40, mr: theme.spacing(2) }}
            />
          </Box>
          {!isMobile && (
            <Box sx={{ display: "flex", gap: theme.spacing(2) }}>
              {["/", "/products", "/contact", "/about"].map((path) => {
                const label =
                  path === "/"
                    ? "Home"
                    : path
                        .replace("/", "")
                        .replace(/^\w/, (c) => c.toUpperCase());
                return (
                  <Button
                    key={path}
                    component={NavLink}
                    to={path}
                    color="inherit"
                    sx={{
                      transition: theme.transitions.create("color"),
                      "&:hover": { color: theme.palette.primary.light },
                      "&.active": { color: theme.palette.primary.dark },
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Box>
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={theme.spacing(1)}>
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: "flex",
              alignItems: "center",
              border: searchOpen
                ? `1px solid ${theme.palette.divider}`
                : "none",
              borderRadius: theme.shape.borderRadius,
              transition: theme.transitions.create(["width", "border"]),
              backgroundColor: searchOpen
                ? theme.palette.background.paper
                : "transparent",
            }}
          >
            {searchOpen && (
              <InputBase
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                sx={{
                  ml: theme.spacing(1),
                  flex: 1,
                  backgroundColor: theme.palette.common.white,
                  borderRadius: theme.shape.borderRadius,
                  px: theme.spacing(1),
                  width: { xs: "100px", sm: "200px" },
                  border: "1px solid transparent",
                  "&:focus": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              />
            )}
            <IconButton
              onClick={handleSearchIconClick}
              color="inherit"
              sx={{
                transition: theme.transitions.create("color"),
                "&:hover": { color: theme.palette.primary.light },
                "&:active": { color: theme.palette.primary.dark },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>
          <IconButton
            component={Link}
            to="/cart"
            color="inherit"
            sx={{
              transition: theme.transitions.create("color"),
              "&:hover": { color: theme.palette.primary.light },
              "&:active": { color: theme.palette.primary.dark },
            }}
          >
            <Badge badgeContent={totalCartQuantity} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          {!userInfo ? (
            <>
              <Button
                component={NavLink}
                to="/login"
                variant="outlined"
                color="primary"
                sx={{
                  ml: theme.spacing(1),
                  transition: theme.transitions.create([
                    "backgroundColor",
                    "color",
                    "borderColor",
                  ]),
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  },
                  "&.active": {
                    color: theme.palette.primary.dark,
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={NavLink}
                to="/register"
                variant="contained"
                color="primary"
                sx={{
                  ml: theme.spacing(1),
                  transition: theme.transitions.create("backgroundColor"),
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                  "&.active": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Register
              </Button>
            </>
          ) : (
            <>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{
                  transition: theme.transitions.create("color"),
                  "&:hover": { color: theme.palette.primary.light },
                  "&:active": { color: theme.palette.primary.dark },
                }}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{
                  "& .MuiMenuItem-root": {
                    transition: theme.transitions.create("backgroundColor"),
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                    "&.active": {
                      backgroundColor: theme.palette.action.hover,
                      color: theme.palette.primary.dark,
                    },
                  },
                }}
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
                    sx={{
                      "&.active": {
                        backgroundColor: theme.palette.action.hover,
                        color: theme.palette.primary.dark,
                      },
                    }}
                  >
                    <DashboardIcon sx={{ mr: theme.spacing(1) }} />
                    Dashboard
                  </MenuItem>
                )}
                <MenuItem
                  component={NavLink}
                  to={`/profile/${userInfo._id}`}
                  onClick={handleMenuClose}
                  sx={{
                    "&.active": {
                      backgroundColor: theme.palette.action.hover,
                      color: theme.palette.primary.dark,
                    },
                  }}
                >
                  <PersonIcon sx={{ mr: theme.spacing(1) }} />
                  Profile
                </MenuItem>
                <MenuItem
                  component={NavLink}
                  to="/wishlist"
                  onClick={handleMenuClose}
                  sx={{
                    "&.active": {
                      backgroundColor: theme.palette.action.hover,
                      color: theme.palette.primary.dark,
                    },
                  }}
                >
                  <FavoriteIcon sx={{ mr: theme.spacing(1) }} />
                  Wishlist
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    onLogout();
                  }}
                >
                  <LogoutIcon sx={{ mr: theme.spacing(1) }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
