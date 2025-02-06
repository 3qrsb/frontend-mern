import React from "react";
import DefaultLayout from "../../components/layouts/default/DefaultLayout";
import ProductCard from "../../components/product/ProductCard";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useWishlist } from "../../context/WishlistContext";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <DefaultLayout title="Wishlist">
      <Container className="py-3">
        {wishlist.length > 0 ? (
          <Row>
            <h2
              className="py-4"
              style={{ fontSize: "24px", marginBottom: "20px" }}
            >
              Wishlist
            </h2>
            {wishlist.map((product) => (
              <Col lg={4} md={6} xs={12} key={product._id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center">
            <img
              src="/public/images/empty-wishlist.png"
              alt="Empty Wishlist"
              style={{ maxWidth: "60%", marginBottom: "20px" }}
            />
            <p>Your wishlist is empty</p>
            <p>Seems like you don't have any wishes here</p>
            <Link
              to="/products"
              className="btn btn-primary mt-3"
              style={{ fontSize: "16px", padding: "10px 20px" }}
            >
              Make a Wish
            </Link>
          </div>
        )}
      </Container>
    </DefaultLayout>
  );
};

export default Wishlist;
