import { Col, Container, Image, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import "./footer.css";
import React from "react";

const DownFooter = () => {
  return (
    <footer id="footer" className="mt-auto">
      <div className="footer-top">
        <Container>
          <Row>
            <Col lg={3} md={6} xs={12} className=" footer-contact">
              <h4>Address</h4>
              <p>
                Astana 020000
                <br />
                Prospekt Mangilik Yel
                <br />
                Kazakhstan
                <br />
                <br />
                <strong>Phone:</strong> 8 777 777 77 77
                <br />
                <strong>Email:</strong> support@gmail.com
                <br />
              </p>
            </Col>
            <Col lg={2} md={6} xs={6} className=" footer-links">
              <h4>Useful Links</h4>
              <ul>
                <li>
                  <i className="bx bx-chevron-right" /> <a href="#">Home</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" /> <a href="#">About us</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" /> <a href="#">Services</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a href="#">Terms of service</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a href="#">Privacy policy</a>
                </li>
              </ul>
            </Col>
            <Col lg={3} md={6} xs={6} className="footer-links">
              <h4>Our Services</h4>
              <ul>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a href="#">Web Design</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a href="#">Web Development</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a href="#">Product Management</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a href="#">Marketing</a>
                </li>
                <li>
                  <i className="bx bx-chevron-right" />{" "}
                  <a href="#">Graphic Design</a>
                </li>
              </ul>
            </Col>
            <Col lg={4} md={6} className="footer-newsletter">
              <h4>Join Our Newsletter</h4>
              <p>
                Stay updated with our latest news, promotions, and updates.
                Subscribe to our newsletter by entering your email below.
              </p>
              <form
                onSubmit={() =>
                  toast.success("Thank you for subscribing to our newsletter!")
                }
              >
                <input
                  type="email"
                  required
                  placeholder="email@domain.com"
                  name="email"
                />
                <input type="submit" defaultValue="Subscribe" />
              </form>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default DownFooter;
