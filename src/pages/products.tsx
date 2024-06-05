//test
import { useEffect, useState } from "react";
import {
  Row,
  Container,
  Col,
  Card,
  Form,
  ListGroup,
  FormSelect,
  Button,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import DefaultLayout from "../components/layouts/default-layout";
import ProductCard from "../components/product-card";
import Paginate from "../components/UI/paginate";
import { useAppDispatch, useAppSelector } from "../redux";
import { getFilterProducts } from "../redux/products/search-list";
import { trackWindowScroll } from "react-lazy-load-image-component";
import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

const Products = () => {
  const params = useParams();
  const { products, categories, brands, page, pages } = useAppSelector(
    (state) => state.productFilter
  );
  const dispatch = useAppDispatch();
  const [brand, setBrand] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const keyword = params.keyword;

  const pageNumber = params.pageNumber || 1;

  const reset = () => {
    setBrand("");
    setCategory("");
    setSearch("");
    setPriceRange([0, 1000]);
  };

  const [sortOrder, setSortOrder] = useState<string>(""); // 'asc' for ascending, 'desc' for descending

  const handleChange = (event: SelectChangeEvent) => {
    setSortOrder(event.target.value as string);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const handleBrandChange = (event: SelectChangeEvent) => {
    setBrand(event.target.value as string);
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleMinPriceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(event.target.value)); // Prevent negative values
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(event.target.value)); // Prevent negative values
    setPriceRange([priceRange[0], value]);
  };

  useEffect(() => {
    dispatch(
      getFilterProducts({
        n: pageNumber,
        b: brand !== "All" ? brand : "",
        c: category !== "All" ? category : "",
        q: search,
        sortOrder: sortOrder,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      })
    );
  }, [dispatch, pageNumber, brand, search, category, sortOrder, priceRange]);

  return (
    <DefaultLayout>
      <Container>
        <Row>
          <Col lg={3}>
            <h2 className="py-4 pb-4">Filter</h2>
            <Card className="shadow p-3">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category-select"
                      value={category}
                      onChange={handleCategoryChange}
                      label="Category"
                    >
                      <MenuItem value="All">All</MenuItem>
                      {categories.map((category: string) => (
                        <MenuItem value={category} key={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ListGroup.Item>
                <ListGroup.Item>
                  <FormControl fullWidth>
                    <InputLabel id="brand-label">Brand</InputLabel>
                    <Select
                      labelId="brand-label"
                      id="brand-select"
                      value={brand}
                      onChange={handleBrandChange}
                      label="Brand"
                    >
                      <MenuItem value="All">All</MenuItem>
                      {brands.map((brand: string) => (
                        <MenuItem value={brand} key={brand}>
                          {brand}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Typography gutterBottom>Price Range ($)</Typography>
                  <div className="d-flex mb-2">
                    <TextField
                      label="Min"
                      variant="outlined"
                      type="number"
                      value={priceRange[0] === 0 ? "" : priceRange[0]} // Prevent leading zero
                      onChange={handleMinPriceInput}
                      onBlur={() => {
                        if (priceRange[0] === 0)
                          setPriceRange([0, priceRange[1]]);
                      }}
                      style={{ marginRight: "10px" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ), // Changed to startAdornment
                      }}
                    />
                    <TextField
                      label="Max"
                      variant="outlined"
                      type="number"
                      value={priceRange[1] === 0 ? "" : priceRange[1]} // Prevent leading zero
                      onChange={handleMaxPriceInput}
                      onBlur={() => {
                        if (priceRange[1] === 0)
                          setPriceRange([priceRange[0], 0]);
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ), // Changed to startAdornment
                      }}
                    />
                  </div>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    max={1000}
                    style={{ width: "100%" }}
                  />
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>

          <Col lg={9}>
            <Row>
              <div className="d-flex">
                <Form.Control
                  onChange={(e: any) => setSearch(e.target.value)}
                  className="me-2"
                  placeholder="Search..."
                  value={search}
                  style={{ width: "95%" }}
                />
                <FormControl fullWidth style={{ margin: "0 10px" }}>
                  <InputLabel id="sort-order-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-order-label"
                    id="sort-order"
                    value={sortOrder}
                    onChange={handleChange}
                    label="Sort Order"
                    style={{ width: "45%" }}
                  >
                    <MenuItem value="oldest">Date added: Oldest</MenuItem>
                    <MenuItem value="latest">Date added: Latest</MenuItem>
                    <MenuItem value="low">Price: Low to High</MenuItem>
                    <MenuItem value="high">Price: High to Low</MenuItem>
                    <MenuItem value="rating">Average Rating</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </Row>
            <Row style={{ minHeight: "80vh" }}>
              {products.map((product) => (
                <Col lg={4} md={6} xs={12} key={product._id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        <Paginate
          pages={pages}
          page={page}
          keyword={keyword ? keyword : ""}
          isAdmin={false}
        />
      </Container>
    </DefaultLayout>
  );
};

export default trackWindowScroll(Products);
