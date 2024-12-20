import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux";
import { reset } from "../redux/cart/cart-slice";
import { userLogout } from "../redux/users/login-slice";
import React from "react";

const Header = () => {
  const { userInfo } = useAppSelector((state) => state.login);
  const { cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(userLogout());
    dispatch(reset());
    navigate("/login");
  };

  const totalCartQuantity = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        sticky="top"
        bg="white"
        className="shadow px-0 py-3"
      >
        <div className="container-xl">
          {/* Logo */}
          <Navbar.Brand as={NavLink} to="/">
            <img
              src="/src/file.png"
              className="avatar rounded me-lg-10"
              alt="..."
            />
          </Navbar.Brand>
          {/* Navbar toggle */}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          {/* Collapse */}
          <Navbar.Collapse id="responsive-navbar-nav">
            {/* Nav */}
            <div className="navbar-nav me-lg-auto">
              <Nav.Item
                as={NavLink}
                className=" nav-link active"
                to="/"
                aria-current="page"
              >
                <span>Home</span>
              </Nav.Item>
              <Nav.Item as={NavLink} className=" nav-link" to="/products">
                <span>Products</span>
              </Nav.Item>

              <Nav.Item as={NavLink} className=" nav-link" to="/contact">
                <span>Contact</span>
              </Nav.Item>
              <Nav.Item as={NavLink} className=" nav-link" to="/about">
                <span>About Us</span>
              </Nav.Item>
            </div>
            {/* Right navigation */}

            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                <Link className="nav-link" to="/products">
                  <i className="fa fa-fw fa-search text-dark me-2"></i>
                </Link>
                <Link
                  className="nav-icon position-relative text-decoration-none"
                  to="/cart"
                >
                  <i className="fa fa-fw fa-cart-arrow-down text-dark me-2"></i>
                  {totalCartQuantity > 0 && (
                    <span className="cart-badge">{totalCartQuantity}</span>
                  )}
                </Link>
              </div>
              {!userInfo ? (
                <>
                  <div className="d-flex align-items-lg-center mt-3 mt-lg-0">
                    <Nav.Link
                      as={NavLink}
                      to="/login"
                      className="btn btn-secondary btn-sm text-white me-3 ms-5 "
                    >
                      Login
                    </Nav.Link>
                  </div>

                  <div className="d-flex align-items-lg-center mt-3 mt-lg-0">
                    <Nav.Link
                      as={NavLink}
                      to="/register"
                      style={{ backgroundColor: "#e03a3c" }}
                      className="btn btn-sm text-white  ms-xs-3 "
                    >
                      Register
                    </Nav.Link>
                  </div>
                </>
              ) : (
                <NavDropdown
                  title={<i className="fa fa-fw fa-user text-dark mr-3"></i>}
                  id="basic-nav-dropdown"
                >
                  {userInfo && (userInfo.isAdmin || userInfo.isSeller) && (
                    <NavDropdown.Item
                      as={NavLink}
                      to={
                        userInfo.isAdmin
                          ? "/dashboard"
                          : "/dashboard/product-list"
                      }
                    >
                      Dashboard
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item
                    as={NavLink}
                    to={`/profile/${userInfo._id}`}
                  >
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to={`/wishlist/`}>
                    Wishlist
                  </NavDropdown.Item>
                  <NavDropdown.Divider
                    style={{ backgroundColor: "#ddd", height: "1px" }}
                  />
                  <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              )}
            </div>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  );
};

export default Header;
