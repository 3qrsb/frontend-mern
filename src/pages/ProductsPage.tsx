import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { trackWindowScroll } from "react-lazy-load-image-component";
import DefaultLayout from "../components/layouts/default/DefaultLayout";
import ProductCard from "../components/product/ProductCard";
import Paginate from "../components/UI/paginate";
import { useAppDispatch, useAppSelector } from "../redux";
import { getFilterProducts } from "../redux/products/search-list";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

const ProductsPage = () => {
  const params = useParams();
  const { products, categories, brands, page, pages } = useAppSelector(
    (state) => state.productFilter
  );
  const dispatch = useAppDispatch();

  const [brand, setBrand] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [sortOrder, setSortOrder] = useState<string>("");

  const keyword = params.keyword;
  const pageNumber = params.pageNumber || 1;

  const resetFilters = () => {
    setBrand("");
    setCategory("");
    setSearch("");
    setPriceRange([0, 2000]);
  };

  const handleSortOrderChange = (event: SelectChangeEvent) => {
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
    const value = Math.max(0, Number(event.target.value));
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(event.target.value));
    setPriceRange([priceRange[0], value]);
  };

  useEffect(() => {
    dispatch(
      getFilterProducts({
        n: pageNumber,
        b: brand !== "All" ? brand : "",
        c: category !== "All" ? category : "",
        q: search,
        sortOrder,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      })
    );
  }, [dispatch, pageNumber, brand, search, category, sortOrder, priceRange]);

  return (
    <DefaultLayout title="Products">
      <Container sx={{ py: 3 }}>
        <Grid container spacing={2}>
          {/* Filter Panel */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h4" sx={{ py: 2 }}>
              Filter
            </Typography>
            <Card sx={{ p: 2, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>
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
                      {categories.map((cat: string) => (
                        <MenuItem value={cat} key={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
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
                      {brands.map((br: string) => (
                        <MenuItem value={br} key={br}>
                          {br}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography gutterBottom>Price Range ($)</Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextField
                      label="Min"
                      variant="outlined"
                      type="number"
                      size="small"
                      value={priceRange[0] === 0 ? "" : priceRange[0]}
                      onChange={handleMinPriceInput}
                      onBlur={() => {
                        if (priceRange[0] === 0)
                          setPriceRange([0, priceRange[1]]);
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        },
                      }}
                    />
                    <TextField
                      label="Max"
                      variant="outlined"
                      type="number"
                      size="small"
                      value={priceRange[1] === 0 ? "" : priceRange[1]}
                      onChange={handleMaxPriceInput}
                      onBlur={() => {
                        if (priceRange[1] === 0)
                          setPriceRange([priceRange[0], 0]);
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    max={2000}
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Search and Product List */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="sort-order-label">Sort By</InputLabel>
                <Select
                  labelId="sort-order-label"
                  id="sort-order"
                  value={sortOrder}
                  onChange={handleSortOrderChange}
                  label="Sort By"
                >
                  <MenuItem value="oldest">Date added: Oldest</MenuItem>
                  <MenuItem value="latest">Date added: Latest</MenuItem>
                  <MenuItem value="low">Price: Low to High</MenuItem>
                  <MenuItem value="high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Average Rating</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Grid container spacing={2} sx={{ minHeight: "80vh" }}>
              {products.map((product: any) => (
                <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
            isAdmin={false}
            urlPrefix={""}
          />
        </Box>
      </Container>
    </DefaultLayout>
  );
};

export default trackWindowScroll(ProductsPage);
