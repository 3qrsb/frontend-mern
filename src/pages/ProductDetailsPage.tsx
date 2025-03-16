import React, { useEffect, useState, useCallback } from "react";
import { Container, Box, Tabs, Tab, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useParams } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";

import DefaultLayout from "../components/layouts/default/DefaultLayout";
import Loader from "../components/UI/loader";
import { useAppDispatch, useAppSelector } from "../redux";
import { addToCart } from "../redux/cart/cart-slice";
import { getProductById } from "../redux/products/slice-details";
import { useWishlist } from "../context/WishlistContext";
import { useCurrencyData } from "../hooks/useCurrencyData";
import toast from "react-hot-toast";
import authAxios from "../utils/auth-axios";
import { setError } from "../utils/error";

import PriceAndControls from "../components/product/PriceAndControls";
import ProductImages from "../components/product/ProductImages";
import ProductInfoCard from "../components/product/ProductInfoCard";
import TabPanel from "../components/TabPanel";
import ReviewsSection from "../components/review/ReviewsSection";

const ProductDetailsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { product, loading } = useAppSelector((state) => state.productDetail);
  const { userInfo } = useAppSelector((state) => state.login);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { cartItems } = useAppSelector((state) => state.cart);
  const { id } = useParams();
  const { currency, rates, baseCurrency } = useCurrencyData();

  const [rating, setRating] = useState<number | null>(1);
  const [comment, setComment] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [editReview, setEditReview] = useState<null | {
    id: string;
    comment: string;
    rating: number;
  }>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTab, setSelectedTab] = useState("0");

  const theme = useTheme();
  const screenSize = useMediaQuery(theme.breakpoints.only("md"));

  const isProductInCart = cartItems.some((item) => item._id === product?._id);
  const averageRating = product?.reviews?.length
    ? product.reviews.reduce(
        (acc: number, review: any) => acc + review.rating,
        0
      ) / product.reviews.length
    : 0;

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

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    review: any
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const onAdd = useCallback(() => {
    if (product && !isProductInCart) {
      dispatch(addToCart({ ...product, qty: 1 }));
    }
  }, [product, isProductInCart, dispatch]);

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
    const updatedReview = { comment, rating };
    authAxios
      .put(`/products/${product?._id}/reviews/${editReview?.id}`, updatedReview)
      .then(() => {
        toast.success("Review updated successfully");
        setEditReview(null);
        setComment("");
        setRating(1);
        setRefresh((prev) => !prev);
      })
      .catch((err) => toast.error(setError(err)));
  };

  const handleDeleteReview = (reviewId: string) => {
    authAxios
      .delete(`/products/${product?._id}/reviews/${reviewId}`)
      .then(() => {
        toast.success("Review deleted successfully");
        setRefresh((prev) => !prev);
      })
      .catch((err) => toast.error(setError(err)));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const review = { comment, rating };
    authAxios
      .post(`/products/${product?._id}/reviews`, review)
      .then(() => {
        toast.success("Thank you for the comment 🙂");
        setRefresh((prev) => !prev);
      })
      .catch((err) => toast.error(setError(err)));
  };

  const handleLike = () => {
    if (!product) return;
    if (isLiked) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
    setIsLiked((prev) => !prev);
  };

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
            <Grid size={{ xs: 12, md: 5 }}>
              <ProductImages
                images={product.images}
                selectedImage={selectedImage}
                onSelectImage={setSelectedImage}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ProductInfoCard
                    product={product}
                    averageRating={averageRating}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <PriceAndControls
                    product={product}
                    currency={currency}
                    rates={rates}
                    baseCurrency={baseCurrency}
                    isProductInCart={isProductInCart}
                    onAdd={onAdd}
                    screenSize={screenSize}
                    isLiked={isLiked}
                    handleLike={handleLike}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              mt: 3,
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              orientation="vertical"
              sx={{
                borderRight: 1,
                borderColor: "divider",
                width: { xs: "100%", md: "200px" },
              }}
            >
              <Tab label="Specifications" value="0" />
              <Tab label="Reviews" value="1" />
              <Tab label="Shipping Info" value="2" />
              <Tab label="Seller Profile" value="3" />
            </Tabs>
            <Box sx={{ flexGrow: 1 }}>
              <TabPanel value={selectedTab} index="0">
                <Box>
                  <Typography variant="h6" color="primary">
                    Specifications
                  </Typography>
                  <Typography variant="body2">
                  </Typography>
                </Box>
              </TabPanel>
              <TabPanel value={selectedTab} index="1">
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <ReviewsSection
                      product={product}
                      userInfo={userInfo}
                      rating={rating}
                      comment={comment}
                      setRating={setRating}
                      setComment={setComment}
                      onSubmit={onSubmit}
                      editReview={editReview}
                      handleEditSubmit={handleEditSubmit}
                      handleEditReview={handleEditReview}
                      handleDeleteReview={handleDeleteReview}
                      anchorEl={anchorEl}
                      handleMenuClick={handleMenuClick}
                      handleMenuClose={handleMenuClose}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={selectedTab} index="2">
                <Box>
                  <Typography variant="h6" color="primary">
                    Shipping Info
                  </Typography>
                  <Typography variant="body2">
                  </Typography>
                </Box>
              </TabPanel>
              <TabPanel value={selectedTab} index="3">
                <Box>
                  <Typography variant="h6" color="primary">
                    Seller Profile
                  </Typography>
                  <Typography variant="body2">
                  </Typography>
                </Box>
              </TabPanel>
            </Box>
          </Box>
        </Container>
      )}
    </DefaultLayout>
  );
};

export default ProductDetailsPage;
