import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { formatCurrencry } from "../utils/helper";
import { ReviewTypes } from "../utils/interfaces";
import ImageLazy from "./UI/lazy-image";
import React, { useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

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
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
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
        <FontAwesomeIcon
          icon={isLiked ? (fasHeart as IconProp) : (farHeart as IconProp)}
          className={`heart-icon ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
        />
      </Card>
    </div>
  );
};

export default ProductCard;
