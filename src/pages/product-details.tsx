import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
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
  IconButton,
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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ReviewIcon from "@mui/icons-material/RateReview";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useWishlist } from "../context/WishlistContext";

const ProductDetails = () => {
  const dispatch = useAppDispatch();
  const { product, loading } = useAppSelector((state) => state.productDetail);
  const { userInfo } = useAppSelector((state) => state.login);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const [rating, setRating] = useState<number | null>(1);
  const [comment, setComment] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const onAdd = () => {
    if (product) {
      dispatch(addToCart({ ...product, qty: quantity } as Product));
    }
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

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  useEffect(() => {
    const isProductInWishlist = wishlist.some(
      (item) => item._id === product?._id
    );
    setIsLiked(isProductInWishlist);
  }, [wishlist, product?._id]);

  const handleLike = () => {
    if (!product) return;

    if (isLiked) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
    setIsLiked(!isLiked);
  };

  const averageRating = product?.reviews?.length
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length
    : 0;

  return (
    <DefaultLayout title={product?.name}>
      {loading || !product ? (
        <Loader />
      ) : (
        <Container
          maxWidth={false}
          sx={{
            py: 3,
            px: { xs: 2, sm: 3, md: 4, lg: 5 },
            margin: "0 auto", // Center the container
            maxWidth: "95%", // Adjust the maximum width
          }}
        >
          <Grid container spacing={2}>
            {/* Product Images Column */}
            <Grid item xs={12} md={5}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent sx={{ display: "flex", justifyContent: "center" }}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "500px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid #ddd",
                    }}
                  >
                    <ImageLazy
                      imageUrl={selectedImage || ""}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                {product?.images?.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: selectedImage === img ? "2px solid #1976d2" : "",
                      cursor: "pointer",
                      mx: 1,
                    }}
                    onClick={() => setSelectedImage(img)}
                  >
                    <ImageLazy
                      imageUrl={img}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Nested Grid for Product Information and Price/Controls */}
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                {/* Product Information Column */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ boxShadow: 3, p: 2, height: "auto" }}>
                    <List>
                      <ListItem>
                        <Typography variant="h5">{product?.name}</Typography>
                      </ListItem>
                      <ListItem>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Rating
                            name="read-only"
                            value={averageRating}
                            readOnly
                            precision={0.5}
                            icon={<StarIcon fontSize="inherit" />}
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {averageRating.toFixed(1)}
                          </Typography>
                        </Box>
                      </ListItem>
                      <ListItem>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <ReviewIcon sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {product?.reviews.length} Reviews
                          </Typography>
                        </Box>
                      </ListItem>
                      <ListItem>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <ShoppingCartIcon sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {product?.totalSales} Orders
                          </Typography>
                        </Box>
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Brand:"
                          secondary={product?.brand}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText
                          primary="Category:"
                          secondary={product?.category}
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <Typography variant="body1">
                          {product?.description}
                        </Typography>
                      </ListItem>
                    </List>
                  </Card>
                </Grid>

                {/* Price and Controls Column */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ boxShadow: 3, p: 2, height: "auto" }}>
                    <List>
                      <ListItem>
                        <Typography variant="h4" color="primary">
                          {formatCurrencry(product?.price)}
                        </Typography>
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <Typography variant="body1">
                          Some additional information here.
                        </Typography>
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            onClick={() =>
                              setQuantity((prev) => Math.max(prev - 1, 1))
                            }
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="h6" sx={{ mx: 2 }}>
                            {quantity}
                          </Typography>
                          <IconButton
                            onClick={() => setQuantity((prev) => prev + 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={onAdd}
                          fullWidth
                          sx={{ mt: 2 }}
                        >
                          Add To Cart
                        </Button>
                      </ListItem>
                      <ListItem>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={handleLike}
                          fullWidth
                          sx={{ mt: 2 }}
                          startIcon={
                            isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />
                          }
                        >
                          {isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                        </Button>
                      </ListItem>
                      <ListItem>
                        <Typography variant="body1">
                          Additional product information or terms.
                        </Typography>
                      </ListItem>
                    </List>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Reviews and Comment Section */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Reviews
                  </Typography>
                  <List>
                    {product?.reviews?.length > 0 ? (
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
