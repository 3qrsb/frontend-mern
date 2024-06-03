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

const Products = () => {
  const params = useParams();
  const { products, categories, brands, page, pages } = useAppSelector(
    (state) => state.productFilter
  );
  const dispatch = useAppDispatch();
  const [brand, setBrand] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const keyword = params.keyword;

  const pageNumber = params.pageNumber || 1;

  const reset = () => {
    setBrand("");
    setCategory("");
    setSearch("");
  };

  const [sortOrder, setSortOrder] = useState<string>(""); // 'asc' for ascending, 'desc' for descending

  const handleChange = (event: SelectChangeEvent) => {
    setSortOrder(event.target.value as string);
  };

  useEffect(() => {
    dispatch(
      getFilterProducts({
        n: pageNumber,
        b: brand,
        c: category,
        q: search,
        sortOrder: sortOrder,
      })
    );
  }, [dispatch, pageNumber, brand, search, category, sortOrder]);

  return (
    <DefaultLayout>
      <Container>
        <Row>
          <Col lg={3}>
            <h2 className="py-2 pb-4">Filter</h2>
            <Card className="shadow p-3">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h4 className="mb-2">Category</h4>
                  <FormSelect
                    defaultValue={"All"}
                    onChange={(e: any) => {
                      if (e.target.value === "All") {
                        reset();
                      } else {
                        setCategory(e.target.value);
                      }
                    }}
                  >
                    <option value="All">All</option>
                    All
                    {categories.map((categorie: any) => (
                      <option value={categorie} key={categorie}>
                        {categorie}
                      </option>
                    ))}
                  </FormSelect>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4 className="mb-2">Brand</h4>
                  <FormSelect
                    defaultValue={"All"}
                    onChange={(e: any) => {
                      if (e.target.value === "All") {
                        reset();
                      } else {
                        setBrand(e.target.value);
                      }
                    }}
                  >
                    <option value="All">All</option>
                    All
                    {brands.map((brand: any) => (
                      <option value={brand} key={brand}>
                        {brand}
                      </option>
                    ))}
                  </FormSelect>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>

          <Col lg={9}>
            <Row>
              <div className="col-md-6 pb-0 py-0">
                <div className="d-flex">
                  <Form.Control
                    onChange={(e: any) => setSearch(e.target.value)}
                    className="me-2"
                    placeholder="Search..."
                    value={search}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="sort-order-label">Sort Order</InputLabel>
                    <Select
                      labelId="sort-order-label"
                      id="sort-order"
                      value={sortOrder}
                      onChange={handleChange}
                      label="Sort Order"
                    >
                      <MenuItem value="">None</MenuItem>
                      <MenuItem value="low">Price Low to High</MenuItem>
                      <MenuItem value="high">Price High to Low</MenuItem>
                    </Select>
                  </FormControl>
                </div>
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
