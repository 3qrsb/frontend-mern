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
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SecurityIcon from "@mui/icons-material/Security";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useNavigate, useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
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
import ShareIcon from "@mui/icons-material/Share";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ReviewIcon from "@mui/icons-material/RateReview";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useWishlist } from "../context/WishlistContext";
import { deepOrange } from "@mui/material/colors";

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
  const [editReview, setEditReview] = useState<null | {
    id: string;
    comment: string;
    rating: number;
  }>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentReview, setCurrentReview] = useState<any>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    review: any
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentReview(review);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentReview(null);
  };
  const onAdd = () => {
    if (product) {
      dispatch(addToCart({ ...product, qty: quantity } as Product));
    }
  };

  const handleEditReview = (review: any) => {
    setEditReview({
      id: review._id,
      comment: review.comment,
      rating: review.rating,
    });
    setComment(review.comment);
    setRating(review.rating);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedReview = {
      comment,
      rating,
    };
    authAxios
      .put(`/products/${product?._id}/reviews/${editReview?.id}`, updatedReview)
      .then((res) => {
        toast.success("Review updated successfully");
        setEditReview(null);
        setComment("");
        setRating(1);
        setRefresh((prev) => !prev);
      })
      .catch((err) => toast.error(setError(err)));
  };

  const handleDeleteReview = (reviewId: any) => {
    authAxios
      .delete(`/products/${product?._id}/reviews/${reviewId}`)
      .then((res) => {
        toast.success("Review deleted successfully");
        setRefresh((prev) => !prev);
      })
      .catch((err) => toast.error(setError(err)));
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
            margin: "0 auto",
            maxWidth: "95%",
          }}
        >
          <Grid container spacing={3}>
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
                    <Zoom>
                      <ImageLazy
                        imageUrl={selectedImage || ""}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Zoom>
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
              <Grid container spacing={3}>
                {/* Product Information Column */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ boxShadow: 3, p: 2, height: "auto" }}>
                    <List>
                      <ListItem>
                        <Typography variant="h5">{product?.name}</Typography>
                      </ListItem>
                      <Divider />
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
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ReviewIcon
                              sx={{ mr: 0.5, fontSize: 20, color: "#1976d2" }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              {product?.reviews.length} Reviews
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ShoppingCartIcon
                              sx={{ mr: 0.5, fontSize: 20, color: "#1976d2" }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              {product?.totalSales} Orders
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                      <ListItem>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body2"
                            sx={{ color: product?.inStock ? "green" : "red" }}
                          >
                            {product?.inStock ? "In Stock" : "Out of Stock"}
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
                  <Card
                    sx={{
                      boxShadow: 3,
                      p: 2,
                      height: "auto",
                      position: "sticky",
                      top: "20px",
                    }}
                  >
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
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          sx={{ mt: 2 }}
                          startIcon={<ShareIcon />}
                        >
                          Share
                        </Button>
                      </ListItem>
                      {/* Trust Badges Section */}
                      <ListItem>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            mt: 2,
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              mx: 1,
                            }}
                          >
                            <SecurityIcon
                              sx={{ fontSize: 30, color: "#1976d2" }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ textAlign: "center", fontSize: "0.75rem" }}
                            >
                              Secure Checkout
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              mx: 1,
                            }}
                          >
                            <MonetizationOnIcon
                              sx={{ fontSize: 30, color: "#1976d2" }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ textAlign: "center", fontSize: "0.75rem" }}
                            >
                              Money-Back Guarantee
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              mx: 1,
                            }}
                          >
                            <LocalShippingIcon
                              sx={{ fontSize: 30, color: "#1976d2" }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ textAlign: "center", fontSize: "0.75rem" }}
                            >
                              Free Shipping
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    </List>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Reviews and Comment Section */}
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Reviews and Comments
                  </Typography>
                  <List>
                    {product?.reviews?.length > 0 ? (
                      product.reviews.map((review) => (
                        <ListItem
                          key={review._id}
                          sx={{
                            flexDirection: "column",
                            alignItems: "flex-start",
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            boxShadow: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "space-between",
                              alignItems: "center",
                              position: "relative",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar sx={{ bgcolor: deepOrange[500], mr: 2 }}>
                                {review.name.charAt(0)}
                              </Avatar>
                              <Typography variant="subtitle1">
                                <strong>{review.name}</strong>
                              </Typography>
                            </Box>
                            {userInfo?._id === review.user && (
                              <Box sx={{ position: "absolute", right: 0 }}>
                                <IconButton
                                  aria-label="more"
                                  aria-controls="long-menu"
                                  aria-haspopup="true"
                                  onClick={(event) =>
                                    handleMenuClick(event, review)
                                  }
                                >
                                  <MoreVertIcon />
                                </IconButton>
                                <Menu
                                  id="long-menu"
                                  anchorEl={anchorEl}
                                  keepMounted
                                  open={Boolean(anchorEl)}
                                  onClose={handleMenuClose}
                                >
                                  <MenuItem
                                    onClick={() => handleEditReview(review)}
                                  >
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleDeleteReview(review._id)
                                    }
                                  >
                                    Delete
                                  </MenuItem>
                                </Menu>
                              </Box>
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            <Rating
                              value={review.rating}
                              readOnly
                              precision={0.5}
                              sx={{ mr: 2 }}
                            />
                            <Typography variant="body2">
                              {getDate(review.createdAt)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {review.comment}
                          </Typography>
                          <Divider sx={{ width: "100%", mt: 2 }} />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>No reviews yet</ListItem>
                    )}
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" color="primary">
                    Leave a Comment
                  </Typography>
                  {userInfo ? (
                    <form onSubmit={editReview ? handleEditSubmit : onSubmit}>
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
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        {editReview ? "Update" : "Submit"}
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
