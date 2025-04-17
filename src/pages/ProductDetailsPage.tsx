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
import PriceAndControls from "../components/product/PriceAndControls";
import ProductImages from "../components/product/ProductImages";
import ProductInfoCard from "../components/product/ProductInfoCard";
import TabPanel from "../components/TabPanel";
import ReviewsSection from "../components/review/ReviewsSection";

const ProductDetailsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { product, loading } = useAppSelector((s) => s.productDetail);
  const { userInfo } = useAppSelector((s) => s.login);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { cartItems } = useAppSelector((s) => s.cart);
  const { id } = useParams<{ id: string }>();
  const { currency, rates, baseCurrency } = useCurrencyData();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState("0");
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.only("md"));

  useEffect(() => {
    if (id) dispatch(getProductById(id));
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  useEffect(() => {
    setIsLiked(wishlist.some((item) => item._id === product?._id));
  }, [wishlist, product?._id]);

  const isInCart = !!product && cartItems.some((c) => c._id === product._id);

  const handleAddToCart = useCallback(() => {
    if (product && !isInCart) {
      dispatch(addToCart({ ...product, qty: 1 }));
    }
  }, [dispatch, isInCart, product]);

  const handleLike = () => {
    if (!product) return;
    isLiked ? removeFromWishlist(product._id) : addToWishlist(product);
    setIsLiked((prev) => !prev);
  };

  const handleTabChange = (_: React.SyntheticEvent, newTab: string) => {
    setSelectedTab(newTab);
  };

  if (loading || !product) {
    return (
      <DefaultLayout title="Loading…">
        <Loader />
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout title={product.name}>
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
                  averageRating={
                    product.reviews.length
                      ? product.reviews.reduce((a, r) => a + r.rating, 0) /
                        product.reviews.length
                      : 0
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <PriceAndControls
                  product={product}
                  currency={currency}
                  rates={rates}
                  baseCurrency={baseCurrency}
                  isProductInCart={isInCart}
                  onAdd={handleAddToCart}
                  screenSize={isMd}
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
            orientation="vertical"
            variant="scrollable"
            scrollButtons="auto"
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              borderRight: 1,
              borderColor: "divider",
              width: { xs: "100%", md: 200 },
              minWidth: { md: 200 },
              flexShrink: 0,
            }}
          >
            <Tab label="Specifications" value="0" />
            <Tab label="Reviews" value="1" />
            <Tab label="Shipping Info" value="2" />
            <Tab label="Seller Profile" value="3" />
          </Tabs>

          <Box sx={{ flexGrow: 1, pl: { md: 2 } }}>
            <TabPanel value={selectedTab} index="0">
              <Typography variant="h6" color="primary">
                Specifications
              </Typography>
            </TabPanel>

            <TabPanel value={selectedTab} index="1">
              {userInfo ? (
                <ReviewsSection
                  productId={product._id}
                  currentUserId={userInfo._id}
                />
              ) : (
                <Typography>Please log in to see and leave reviews.</Typography>
              )}
            </TabPanel>

            <TabPanel value={selectedTab} index="2">
              <Typography variant="h6" color="primary">
                Shipping Info
              </Typography>
            </TabPanel>

            <TabPanel value={selectedTab} index="3">
              <Typography variant="h6" color="primary">
                Seller Profile
              </Typography>
            </TabPanel>
          </Box>
        </Box>
      </Container>
    </DefaultLayout>
  );
};

export default ProductDetailsPage;
