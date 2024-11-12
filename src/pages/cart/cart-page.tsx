import {
  Container,
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Card,
} from "react-bootstrap";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DefaultLayout from "../../components/layouts/default-layout";
import Message from "../../components/UI/message";
import { useAppDispatch, useAppSelector } from "../../redux";
import { addToCart, removeFromCart } from "../../redux/cart/cart-slice";
import { formatCurrencry } from "../../utils/helper";
import ImageLazy from "../../components/UI/lazy-image";
import React from "react";

const CartPage = () => {
  const { cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  return (
    <DefaultLayout title="Cart">
      <Container className="py-3">
        {cartItems.length === 0 ? (
          <div className="empty-cart-container text-center">
            <img
              src="public/images/empty-cart.png"
              alt="Empty Cart"
              style={{
                maxWidth: "30%",
                marginBottom: "20px",
                marginTop: "100px",
              }}
            />
            <p style={{ marginTop: "70px" }}>Your cart is empty</p>
            <Link to="/products" className="btn btn-primary mt-3">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item
                    key={item._id}
                    className="shadow rounded p-5 bg-white mb-2"
                  >
                    <Row className="d-flex align-items-center">
                      <Col md={2}>
                        <ImageLazy
                          imageUrl={item.image}
                          style={{ objectFit: "contain" }}
                          className="h-16 w-16 rounded-5"
                        />
                      </Col>
                      <Col className="d-none d-lg-block">{item.name}</Col>
                      <Col>{item?.qty}</Col>

                      <Col>{formatCurrencry(item.price * item.qty)}</Col>
                      <Col>
                        <FaPlus
                          onClick={() => {
                            if (item.qty < item.availableQty) {
                              dispatch(addToCart(item));
                            } else {
                              toast.dismiss(); // I know the code is trash af
                              toast.error(
                                "Cannot add more items. Stock limit reached."
                              );
                            }
                          }}
                          size={"1.5rem"}
                          style={{ backgroundColor: "#e03a3c" }}
                          className={`icons__cart m-2 rounded-circle text-white p-1 cursor-pointer ${
                            item.qty >= item.availableQty ? "disabled" : ""
                          }`}
                        />
                        <FaMinus
                          size={"1.5rem"}
                          style={{ backgroundColor: "#e03a3c" }}
                          className={`icons__cart m-2 rounded-circle text-white p-1 cursor-pointer `}
                          onClick={() => dispatch(removeFromCart(item))}
                        />
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card className="shadow ">
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item as="h2">
                      SubTotal (
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}) item
                    </ListGroup.Item>
                    <ListGroup.Item className=" d-flex justify-content-between align-items-center">
                      <span>Total Price</span>
                      <span>
                        {formatCurrencry(
                          cartItems.reduce(
                            (acc, item) => acc + item.price * item.qty,
                            0
                          )
                        )}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className=" d-flex justify-content-between align-items-center">
                      <Button
                        style={{ backgroundColor: "#e03a3c" }}
                        disabled={cartItems.length === 0}
                        onClick={() => navigate("/shipping-address")}
                        className="w-1/2 text-white me-2"
                        variant="outline-none"
                      >
                        Place Order
                      </Button>
                      <Button
                        style={{ backgroundColor: "#e03a3c" }}
                        onClick={() => navigate("/")}
                        className="w-1/2 text-white me-2"
                        variant="outline-none"
                      >
                        Back to Shopping
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </DefaultLayout>
  );
};

export default CartPage;
