import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "../components/layouts/default-layout";
import { Product } from "../components/product-card";
import Loader from "../components/UI/loader";
import Message from "../components/UI/message";
import RedButton from "../components/UI/red-button";
import { useAppDispatch, useAppSelector } from "../redux";
import { addToCart } from "../redux/cart/cart-slice";
import { getProductById } from "../redux/products/slice-details";
import authAxios from "../utils/auth-axios";
import { setError } from "../utils/error";
import { formatCurrencry, getDate } from "../utils/helper";
import ImageLazy from "../components/UI/lazy-image";
import Rating from "@mui/material/Rating"; // Import MUI Rating component
import Box from "@mui/material/Box"; // Import MUI Box component for layout

const ProductDetails = () => {
  const dispatch = useAppDispatch();
  const { product, loading } = useAppSelector((state) => state.productDetail);
  const { userInfo } = useAppSelector((state) => state.login);
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const [rating, setRating] = useState<number | null>(1); // Default value set to 1
  const [comment, setComment] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);

  const onAdd = () => {
    dispatch(addToCart(product as Product));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const review = {
      comment,
      rating,
    };
    authAxios
      .post(`/products/${product?._id}/reviews`, review)
      .then((res) => {
        toast.success("Thank you for the comment 🙂");
        setRefresh((prev) => (prev = !prev));
      })
      .catch((err) => toast.error(setError(err)));
  };

  useEffect(() => {
    dispatch(getProductById(id));
    window.scrollTo(0, 0);
  }, [id, dispatch, refresh]);

  return (
    <DefaultLayout title={product?.name}>
      {loading || !product ? (
        <Loader />
      ) : (
        <Container className="py-3">
          <Row>
            <Col md={7}>
              <Card className="shadow">
                <div className="d-flex justify-content-center">
                  <ImageLazy
                    imageUrl={product?.image}
                    style={{
                      width: "500px",
                      height: "480px",
                      objectFit: "contain",
                    }}
                    className="p-2 align-self-center"
                  />
                </div>
              </Card>
            </Col>
            <Col md={5}>
              <ListGroup
                variant="flush"
                className="shadow p-5 bg-white rounded"
              >
                <ListGroup.Item>
                  <h2>{product?.name}</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  {" "}
                  <h5 className=" d-flex justify-content-between align-items-center">
                    <span>Price:</span>
                    <span>{formatCurrencry(product.price)}</span>
                  </h5>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    <span>Category:</span>
                    <span>{product.category}</span>
                  </h5>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h5 className=" d-flex justify-content-between align-items-center">
                    <span>Brand:</span>
                    <span>{product.brand}</span>
                  </h5>
                </ListGroup.Item>
                <ListGroup.Item>{product.description}</ListGroup.Item>
                <ListGroup.Item>
                  <RedButton onClick={onAdd} className="w-full">
                    Add To Cart
                  </RedButton>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={7}>
              <Card>
                <Card.Body>
                  <h3 style={{ color: "#e03a3c" }}>Reviews</h3>
                  <ListGroup variant="flush">
                    {product.reviews.map((review) => (
                      <ListGroup.Item key={review._id}>
                        <div className="d-flex">
                          <strong>{review.name}</strong>
                          <Rating
                            value={review.rating}
                            readOnly
                            precision={0.5}
                          />
                          <p>{getDate(review.createdAt)}</p>
                        </div>
                        <p>{review.comment}</p>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={5}>
              <ListGroup className="bg-white p-3">
                <ListGroup.Item>
                  <h3 style={{ color: "#e03a3c" }}>Comment</h3>
                  {userInfo ? (
                    <Form onSubmit={onSubmit}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Box
                          component="fieldset"
                          mb={3}
                          borderColor="transparent"
                        >
                          <Rating
                            name="rating"
                            value={rating}
                            onChange={(event, newValue) => {
                              if (newValue !== null) {
                                setRating(newValue);
                              }
                            }}
                          />
                        </Box>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          required
                          onChange={(e) => setComment(e.target.value)}
                          as={"textarea"}
                          rows={3}
                        />
                      </Form.Group>
                      <Button
                        style={{ backgroundColor: "#e03a3c", color: "#fff" }}
                        className="mt-2 w-full"
                        variant="outline-none"
                        type="submit"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>You must login to leave a review </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      )}
    </DefaultLayout>
  );
};

export default ProductDetails;
