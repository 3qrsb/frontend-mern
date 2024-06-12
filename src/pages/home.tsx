import { useEffect, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import DefaultLayout from "../components/layouts/default-layout";
import ProductCard from "../components/product-card";
import Loader from "../components/UI/loader";
import { useAppDispatch, useAppSelector } from "../redux";
import { getProducts } from "../redux/products/slice-list";
import { trackWindowScroll } from "react-lazy-load-image-component";
import React from "react";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.productList);
  const { categories } = useAppSelector((state) => state.productFilter);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <DefaultLayout>
      <Container>
        <Row className="mt-3 mb-4 justify-content-center">
          <Col xs={12} className="text-center">
            <h2 className="mb-2 mt-2">Latest Products</h2>
            <hr className="w-50 mx-auto" />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() => handleCategoryFilter("")}
              active={!selectedCategory}
            >
              All
            </Button>
            {categories.map((category: string) => (
              <Button
                key={category}
                variant="outline-primary"
                className="me-2"
                onClick={() => handleCategoryFilter(category)}
                active={selectedCategory === category}
              >
                {category}
              </Button>
            ))}
          </Col>
        </Row>
        {loading || !products ? (
          <Loader />
        ) : (
          <Row md={3} xs={1} lg={4} style={{marginBottom: "10px"}}>
            {products
              .filter(
                (product) =>
                  !selectedCategory || product.category === selectedCategory
              )
              .map((product) => (
                <Col key={product._id}>
                  <ProductCard product={product} />
                </Col>
              ))}
          </Row>
        )}
      </Container>
    </DefaultLayout>
  );
};

export default trackWindowScroll(HomePage);
