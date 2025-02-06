import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DefaultLayout from "../components/layouts/default/DefaultLayout";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/UI/loader";
import { useAppDispatch, useAppSelector } from "../redux";
import { getProducts } from "../redux/products/slice-list";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.productList);
  const { categories } = useAppSelector((state) => state.productFilter);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <DefaultLayout>
      <Container sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Latest Products
          </Typography>
          <Divider sx={{ width: "50%", mx: "auto", mb: 2 }} />
          <Typography variant="subtitle1" color="text.secondary">
            Discover the newest additions to our collection.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 1,
            mb: 4,
          }}
        >
          <Button
            variant={selectedCategory === "" ? "contained" : "outlined"}
            onClick={() => handleCategoryFilter("")}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "contained" : "outlined"}
              onClick={() => handleCategoryFilter(category)}
            >
              {category}
            </Button>
          ))}
        </Box>

        {loading || !products ? (
          <Loader />
        ) : (
          <Grid container spacing={3}>
            {products
              .filter(
                (product) =>
                  !selectedCategory || product.category === selectedCategory
              )
              .map((product) => (
                <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <ProductCard product={product} />
                </Grid>
              ))}
          </Grid>
        )}
      </Container>
    </DefaultLayout>
  );
};

export default HomePage;
