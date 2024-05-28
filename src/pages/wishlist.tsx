import React from "react";
import DefaultLayout from "../components/layouts/default-layout";
import ProductCard from "../components/product-card";
import { Container, Row, Col } from "react-bootstrap";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <DefaultLayout>
      <Container>
        <h2 className="py-4">Wishlist</h2>
        <Row>
          {wishlist.length > 0 ? (
            wishlist.map((product) => (
              <Col lg={4} md={6} xs={12} key={product._id}>
                <ProductCard product={product} />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="btn btn-danger mt-2"
                >
                  Remove
                </button>
              </Col>
            ))
          ) : (
            <p>Your wishlist is empty</p>
          )}
        </Row>
      </Container>
    </DefaultLayout>
  );
};

export default Wishlist;
