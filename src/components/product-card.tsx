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
import { useAppDispatch, useAppSelector } from "../redux";

export type Product = {
  _id: number | string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  description: string;
  qty: number;
  createdAt: Date;
  reviews: ReviewTypes[];
};

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  const { userInfo } = useAppSelector((state) => state.login);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const isProductInWishlist = wishlist.some(
      (item) => item._id === product._id
    );
    setIsLiked(isProductInWishlist);
  }, [wishlist, product._id]);

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
        }}
      >
        <Link to={`/products/${product._id}`}>
          <ImageLazy
            imageUrl={product.image}
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
