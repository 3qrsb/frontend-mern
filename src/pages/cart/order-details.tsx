import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { Card, Col, Container, ListGroup, Row, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "../../components/layouts/default-layout";
import Loader from "../../components/UI/loader";
import { useAppDispatch, useAppSelector } from "../../redux";
import { getOrderById } from "../../redux/orders/order-details";
import { formatCurrencry } from "../../utils/helper";
import toast from "react-hot-toast";
import ImageLazy from "../../components/UI/lazy-image";
import axios from "axios";
import React from "react";

const stripePromise = loadStripe(import.meta.env.VITE_API_STRIPE);

const OrderDetails = () => {
  const { order, loading } = useAppSelector((state) => state.orderDetail);
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const [loadingPayment, setLoadingPayment] = useState(false);
  const navigate = useNavigate();

  const itemsPrice: number | undefined = order?.cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const taxPrice = 0;
  const shippingPrice = itemsPrice ? (itemsPrice >= 200 ? 0 : 30) : 0;
  const discountAmount = order?.discountAmount || 0;
  const totalPrice =
    itemsPrice && itemsPrice + taxPrice + shippingPrice - discountAmount;

  const handlePayment = async () => {
    setLoadingPayment(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/stripe/create-checkout-session",
        {
          items: order?.cartItems,
          orderId: order?._id,
        }
      );

      const session = response.data;

      if (session && session.id) {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Stripe failed to initialize.");
        }
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (result.error) {
          console.error(result.error.message);
          setLoadingPayment(false);
          toast.error("Payment failed. Please try again.");
        }
      }
    } catch (error: any) {
      let errorMessage = "Payment failed. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = `Payment failed. ${error.response.data.message}`;
      }
      console.error("Error:", error);
      setLoadingPayment(false);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  return (
    <DefaultLayout title="Order Details">
      <Container className="py-3">

        {loading ? (
          <Loader />
        ) : (
          <Row>
            <Col md={8} className="mb-sm-3 mb-2">
              <Card>
                <Card.Body>
                  <h4>Order Summary</h4>
                  <ListGroup variant="flush">
                    {order?.cartItems.map((item) => (
                      <ListGroup.Item key={item._id}>
                        <Row className="d-flex align-items-center">
                          <Col md={2}>
                            <ImageLazy
                              imageUrl={item.image}
                              style={{ objectFit: "contain" }}
                              className="avatar rounded-5 h-16 w-16"
                            />
                          </Col>
                          <Col md={6} className="d-none d-lg-block">
                            {item.name}
                          </Col>
                          <Col>{item?.qty}</Col>
                          <Col>{formatCurrencry(item.price * item.qty)}</Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <h2 className="text-center">Payment</h2>
                  <ListGroup variant="flush">
                    <ListGroup.Item as="h2">
                      SubTotal (
                      {order?.cartItems.reduce(
                        (acc, item) => acc + item.qty,
                        0
                      )}
                      ) item
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Total Price</span>
                      <span>
                        {formatCurrencry(
                          order?.cartItems.reduce(
                            (acc, item) => acc + item.price * item.qty,
                            0
                          )
                        )}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Tax Price</span>
                      <span>{formatCurrencry(taxPrice)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>Shipping Price</span>
                      <span>{formatCurrencry(shippingPrice)}</span>
                    </ListGroup.Item>
                    {order?.isPaid && order.discountAmount > 0 && (
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span>Discount</span>
                        <span>-{formatCurrencry(order.discountAmount)}</span>
                      </ListGroup.Item>
                    )}
                    <ListGroup.Item>
                      <h5 className="d-flex justify-content-between align-items-center">
                        <span>Total Price</span>
                        <span>{formatCurrencry(totalPrice)}</span>
                      </h5>
                    </ListGroup.Item>
                    {!order?.isPaid && (
                      <ListGroup.Item className="stripe__container">
                        <Button
                          variant="primary"
                          onClick={handlePayment}
                          disabled={loadingPayment}
                        >
                          {loadingPayment ? "Processing..." : "Pay Now"}
                        </Button>
                      </ListGroup.Item>
                    )}
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

export default OrderDetails;
