import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import { useWishlist } from "../../context/WishlistContext";
import { useAppSelector, useAppDispatch } from "../../redux";
import { formatCurrencry } from "../../utils/helper";
import { addToCart, removeFromCart } from "../../redux/cart/cart-slice";
import { Product } from "../../types/product";
import { useAverageRating } from "../../hooks/useAverageRating";
import ProductActionsOverlay from "./ProductActionsOverlay";

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.login);
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isLiked, setIsLiked] = useState(false);
  const averageRating = useAverageRating(product.reviews);

  const isInCart = cartItems.some((item) => item._id === product._id);

  useEffect(() => {
    const isProductInWishlist = wishlist.some(
      (item) => item._id === product._id
    );
    setIsLiked(isProductInWishlist);
  }, [wishlist, product._id]);

  const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiked) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
    setIsLiked(!isLiked);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      dispatch(removeFromCart(product));
    } else {
      dispatch(addToCart(product));
    }
  };

  return (
    <Card
      sx={{
        width: { xs: "100%", sm: "100%" },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        "&:hover .overlay": { opacity: 1 },
      }}
    >
      <CardActionArea component={Link} to={`/products/${product._id}`}>
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            image={product.images?.[0] || ""}
            alt={product.name}
            sx={{
              width: "100%",
              height: { xs: 150, sm: 200 },
              objectFit: "contain",
              p: 1,
            }}
          />
          {averageRating > 0 && (
            <Chip
              label={averageRating.toFixed(1)}
              color={
                averageRating < 2
                  ? "error"
                  : averageRating < 4
                  ? "warning"
                  : "success"
              }
              size="small"
              sx={{
                position: "absolute",
                top: (theme) => theme.spacing(1),
                left: (theme) => theme.spacing(1),
                zIndex: 1,
              }}
            />
          )}
        </Box>
        <Divider />
        <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {formatCurrencry(product.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <ProductActionsOverlay
        isLiked={isLiked}
        isInCart={isInCart}
        onLike={handleLike}
        onAddToCart={handleAddToCart}
        showWishlist={!!userInfo}
      />
    </Card>
  );
};

export default ProductCard;
