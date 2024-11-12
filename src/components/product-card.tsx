import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatCurrencry } from "../utils/helper";
import { ReviewTypes } from "../utils/interfaces";
import ImageLazy from "./UI/lazy-image";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { useWishlist } from "../context/WishlistContext";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useAppSelector } from "../redux";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";

export type Product = {
  inStock: boolean;
  _id: number | string;
  name: string;
  price: number;
  images: string[]; // Array of images
  image?: string; // Optional single image for backward compatibility
  category: string;
  brand: string;
  description: string;
  qty: number;
  availableQty: number;
  createdAt: Date;
  reviews: ReviewTypes[];
  totalSales: number;
  user: string;
};

type Props = {
  product: Product;
};

interface StyledBadgeProps extends BadgeProps {
  rating: number;
}

const StyledBadge = styled(Badge)<StyledBadgeProps>(({ theme, rating }) => ({
  "& .MuiBadge-badge": {
    right: 127,
    top: 7,
    padding: "0 7px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    borderRadius: "6px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    backgroundColor:
      rating < 2 ? "#FF8080" : rating < 4 ? "#FFBE73" : "#C1FB94",
    color: rating < 2 ? "#910B04" : rating < 4 ? "#915004" : "#0E4D12",
  },
}));

const ProductCard = ({ product }: Props) => {
  const { userInfo } = useAppSelector((state) => state.login);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isLiked, setIsLiked] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    const isProductInWishlist = wishlist.some(
      (item) => item._id === product._id
    );
    setIsLiked(isProductInWishlist);

    // Calculate average rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const avgRating = totalRating / product.reviews.length;
      setAverageRating(avgRating);
    } else {
      setAverageRating(0);
    }
  }, [wishlist, product._id, product.reviews]);

  const handleLike = () => {
    if (isLiked) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="product-card">
      <Card
        className="my-3 p-3"
        style={{
          height: "320px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {averageRating > 0 && (
          <StyledBadge
            badgeContent={averageRating.toFixed(1)}
            color="default"
            rating={averageRating}
            overlap="rectangular"
          />
        )}
        <Link to={`/products/${product._id}`}>
          <ImageLazy
            imageUrl={product.images?.[0] || ""} // Use the first image from the images array
            style={{
              height: "200px",
              width: "250px",
              objectFit: "contain",
            }}
          />

          <Card.Body style={{ textAlign: "center" }}>
            <Card.Title className="mb-4">
              <span className="fs-2">{product.name}</span>
              <br />
              <span className="text-muted">
                {formatCurrencry(product.price)}
              </span>
            </Card.Title>
          </Card.Body>
        </Link>
        {userInfo && (
          <FontAwesomeIcon
            icon={isLiked ? (fasHeart as IconProp) : (farHeart as IconProp)}
            className={`heart-icon ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
          />
        )}
      </Card>
    </div>
  );
};

export default ProductCard;
