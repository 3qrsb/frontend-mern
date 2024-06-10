import React from "react";
import { Container, Navbar } from "react-bootstrap";
import { useAppSelector } from "../../redux";

const Topbar = () => {
  const { userInfo } = useAppSelector((state) => state.login);

  return (
    <header
      className="border-bottom pt-6 shadow text-white "
      style={{ backgroundColor: "#1b1b1b" }}
    >
      <Container fluid>
        <div className="mb-npx h-16">
          <div className="row align-items-center ">
            <div className="col-sm-6 col-12 mb-4 mb-sm-0 ">
              <h1 className="mb-2 ">
                <Navbar.Brand href="#home"></Navbar.Brand>
              </h1>
            </div>
            <div className="col-sm-6 col-12 text-sm-end text-xl">
              {userInfo?.isAdmin ? "Admin Dashboard" : "Seller Dashboard"}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Topbar;
