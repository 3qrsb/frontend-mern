import React, { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import GrainOutlinedIcon from "@mui/icons-material/GrainOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { reset } from "../../../redux/cart/cart-slice";
import { userLogout } from "../../../redux/users/login-slice";
import ProductModal from "../../product/ProductModal";

interface SidebarProps {
  mobileOpen: boolean;
  handleMobileToggle: () => void;
}

const expandedWidth = 240;
const collapsedWidth = 60;

const listItemButtonSx = (open: boolean) => ({
  color: "white",
  justifyContent: open ? "initial" : "center",
  px: 2.5,
  "&.Mui-selected": {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});

const listItemIconSx = (open: boolean) => ({
  minWidth: 0,
  mr: open ? 2 : "auto",
  justifyContent: "center",
  color: "white",
});

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  handleMobileToggle,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAppSelector((state) => state.login);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const headerHeight = { xs: 55, sm: 64 };
  const [open, setOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleToggleDrawer = () => setOpen((prev) => !prev);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const onLogout = () => {
    dispatch(userLogout());
    dispatch(reset());
    navigate("/login");
  };

  const navItems = userInfo?.isSeller
    ? [
        {
          text: "Products",
          icon: <GrainOutlinedIcon />,
          link: "/dashboard/product-list",
        },
      ]
    : [
        {
          text: "Statistics",
          icon: <BarChartOutlinedIcon />,
          link: "/dashboard",
        },
        {
          text: "Products",
          icon: <GrainOutlinedIcon />,
          link: "/dashboard/product-list",
        },
        {
          text: "Users",
          icon: <PeopleAltIcon />,
          link: "/dashboard/user-list",
        },
        {
          text: "Orders",
          icon: <AssignmentOutlinedIcon />,
          link: "/dashboard/orders-list",
        },
      ];

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-end" : "center",
          borderBottom: 1,
          borderColor: "grey.700",
        }}
      >
        {!isMobile && (
          <IconButton onClick={handleToggleDrawer} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            onMouseEnter={() =>
              item.text === "Products" && setHoveredItem(item.text)
            }
            onMouseLeave={() =>
              item.text === "Products" && setHoveredItem(null)
            }
          >
            <Tooltip title={open ? "" : item.text} placement="right">
              <ListItemButton
                component={NavLink}
                to={item.link}
                selected={location.pathname === item.link}
                sx={listItemButtonSx(open)}
              >
                <ListItemIcon sx={listItemIconSx(open)}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} />}
                {item.text === "Products" &&
                  open &&
                  hoveredItem === "Products" && (
                    <Tooltip title="Add Product" placement="right">
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleModalOpen();
                        }}
                        size="small"
                        sx={{ color: "white" }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to={`/profile/${userInfo?._id}`}
            sx={listItemButtonSx(open)}
          >
            <ListItemIcon sx={listItemIconSx(open)}>
              <PersonIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Profile" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={onLogout} sx={listItemButtonSx(open)}>
            <ListItemIcon sx={listItemIconSx(open)}>
              <LogoutIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Logout" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleMobileToggle}
          container={document.body}
          ModalProps={{ keepMounted: true, disableScrollLock: false }}
          sx={{
            "& .MuiDrawer-paper": {
              position: "fixed",
              top: headerHeight,
              height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
              width: expandedWidth,
              boxSizing: "border-box",
              backgroundColor: "#1b1b1b",
              color: "white",
              overflowY: "auto",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open
          sx={{
            top: headerHeight,
            width: open ? expandedWidth : collapsedWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              top: headerHeight,
              height: { xs: `calc(100vh - 56px)`, sm: `calc(100vh - 64px)` },
              width: open ? expandedWidth : collapsedWidth,
              boxSizing: "border-box",
              backgroundColor: "#1b1b1b",
              color: "white",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
      <ProductModal
        setRefresh={() => {}}
        show={modalOpen}
        handleClose={handleModalClose}
      />
    </>
  );
};

export default Sidebar;
