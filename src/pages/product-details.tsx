import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Box,
  Rating,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import DefaultLayout from "../components/layouts/default-layout";
import { Product } from "../components/product-card";
import Loader from "../components/UI/loader";
import Message from "../components/UI/message";
import { useAppDispatch, useAppSelector } from "../redux";
import { addToCart } from "../redux/cart/cart-slice";
import { getProductById } from "../redux/products/slice-details";
import authAxios from "../utils/auth-axios";
import { setError } from "../utils/error";
import { formatCurrencry, getDate } from "../utils/helper";
import ImageLazy from "../components/UI/lazy-image";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const dispatch = useAppDispatch();
  const { product, loading } = useAppSelector((state) => state.productDetail);
  const { userInfo } = useAppSelector((state) => state.login);
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const [rating, setRating] = useState<number | null>(1);
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
        setRefresh((prev) => !prev);
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
        <Container sx={{ py: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent sx={{ display: "flex", justifyContent: "center" }}>
                  <ImageLazy
                    imageUrl={product?.image}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxWidth: "500px",
                      maxHeight: "480px",
                      objectFit: "contain",
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ boxShadow: 3, p: 2 }}>
                <List>
                  <ListItem>
                    <Typography variant="h5">{product?.name}</Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Price:"
                      secondary={formatCurrencry(product.price)}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Category:"
                      secondary={product.category}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Brand:" secondary={product.brand} />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <Typography variant="body1">
                      {product.description}
                    </Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onAdd}
                      fullWidth
                    >
                      Add To Cart
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Reviews
                  </Typography>
                  <List>
                    {product.reviews?.length > 0 ? (
                      product.reviews.map((review) => (
                        <ListItem
                          key={review._id}
                          sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="subtitle1">
                              <strong>{review.name}</strong>
                            </Typography>
                            <Rating
                              value={review.rating}
                              readOnly
                              precision={0.5}
                            />
                            <Typography variant="body2">
                              {getDate(review.createdAt)}
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {review.comment}
                          </Typography>
                          <Divider sx={{ width: "100%", mt: 1 }} />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>No reviews yet</ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Comment
                  </Typography>
                  {userInfo ? (
                    <form onSubmit={onSubmit}>
                      <Rating
                        name="rating"
                        value={rating}
                        onChange={(event, newValue) => {
                          if (newValue !== null) {
                            setRating(newValue);
                          }
                        }}
                      />
                      <TextField
                        required
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        label="Comment"
                        multiline
                        rows={3}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Submit
                      </Button>
                    </form>
                  ) : (
                    <Message>You must login to leave a review</Message>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}
    </DefaultLayout>
  );
};

export default ProductDetails;
