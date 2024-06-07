import React, { useState } from "react";
import { Navbar, Container, Button, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import GrainOutlinedIcon from "@mui/icons-material/GrainOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useAppDispatch, useAppSelector } from "../../redux";
import { reset } from "../../redux/cart/cart-slice";
import { userLogout } from "../../redux/users/login-slice";
import { NavLink } from "react-router-dom";
import { IconButton, ListItemIcon, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProductModal from "../../components/modals/product-modal";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userInfo } = useAppSelector((state) => state.login);
  const [show, setShow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const onLogout = () => {
    dispatch(userLogout());
    dispatch(reset());
    navigate("/login");
  };

  const onOpen = () => setShow(true);
  const onClose = () => setShow(false);

  const navItems = [
    { text: "Statistics", icon: <BarChartOutlinedIcon />, link: "/dashboard" },
    {
      text: "Products",
      icon: <GrainOutlinedIcon />,
      link: "/dashboard/product-list",
    },
    { text: "Users", icon: <PeopleAltIcon />, link: "/dashboard/user-list" },
    {
      text: "Orders",
      icon: <AssignmentOutlinedIcon />,
      link: "/dashboard/orders-list",
    },
  ];

  return (
    <Navbar
      expand="lg"
      variant="dark"
      className="show navbar-vertical px-0 py-3 border-bottom border-bottom-lg-0"
      id="navbarVertical"
      style={{ backgroundColor: "#1b1b1b" }}
    >
      <Container fluid>
        <Button
          className="navbar-toggler ms-n2"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarCollapse"
          aria-controls="sidebarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </Button>
        <Link
          className="navbar-brand py-lg-2 mb-lg-5 px-lg-6 me-0 d-flex align-items-center"
          to="/"
        >
          <h2 className="logo text-white">
            <span className="text-danger"></span>Home
          </h2>
        </Link>

        <div className="collapse navbar-collapse" id="sidebarCollapse">
          <ul className="navbar-nav">
            {navItems.map((item) => (
              <li
                key={item.text}
                className="nav-item position-relative"
                onMouseEnter={() =>
                  item.text === "Products" && setIsHovered(true)
                }
                onMouseLeave={() =>
                  item.text === "Products" && setIsHovered(false)
                }
              >
                <Tooltip title={item.text} placement="right">
                  <Link
                    className={`nav-link p-5 ${
                      location.pathname === item.link ? "active" : ""
                    }`}
                    to={item.link}
                  >
                    <ListItemIcon sx={{ color: "white" }}>
                      {item.icon}
                    </ListItemIcon>
                    {item.text}
                  </Link>
                </Tooltip>
                {item.text === "Products" && isHovered && (
                  <Tooltip title="Add Product" placement="right">
                    <IconButton
                      onClick={onOpen}
                      size="small"
                      sx={{
                        position: "absolute",
                        right: 1,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </li>
            ))}
          </ul>

          <hr className="navbar-divider my-5 opacity-20" />

          <div className="" />
          <ul className="navbar-nav">
            <li className="nav-item">
              <Nav.Link as={NavLink} to={`/profile/${userInfo?._id}`}>
                <i className="bi bi-person-square" /> Profile
              </Nav.Link>
            </li>
            <li className="nav-item">
              <Nav.Link onClick={onLogout}>
                <i className="bi bi-box-arrow-left" /> Logout
              </Nav.Link>
            </li>
          </ul>
        </div>
      </Container>
      <ProductModal setRefresh={() => {}} show={show} handleClose={onClose} />
    </Navbar>
  );
};

export default Sidebar;
