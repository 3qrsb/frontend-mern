import React from "react";
import { Box, IconButton } from "@mui/material";
import { FaHeart, FaCartPlus, FaCartArrowDown } from "react-icons/fa";

type ProductActionsOverlayProps = {
  isLiked: boolean;
  isInCart: boolean;
  onLike: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showWishlist?: boolean;
};

const ProductActionsOverlay: React.FC<ProductActionsOverlayProps> = ({
  isLiked,
  isInCart,
  onLike,
  onAddToCart,
  showWishlist = true,
}) => {
  return (
    <Box
      className="overlay"
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        transition: "opacity 0.3s ease-in-out",
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      {showWishlist && (
        <IconButton
          onClick={onLike}
          aria-label="add to wishlist"
          sx={{ color: "white", mx: 1, pointerEvents: "auto" }}
        >
          {isLiked ? (
            <FaHeart size={24} color="crimson" />
          ) : (
            <FaHeart size={24} />
          )}
        </IconButton>
      )}
      <IconButton
        onClick={onAddToCart}
        aria-label="add to cart"
        sx={{
          color: isInCart ? "green" : "white",
          mx: 1,
          pointerEvents: "auto",
        }}
      >
        {isInCart ? <FaCartArrowDown size={24} /> : <FaCartPlus size={24} />}
      </IconButton>
    </Box>
  );
};

export default ProductActionsOverlay;
