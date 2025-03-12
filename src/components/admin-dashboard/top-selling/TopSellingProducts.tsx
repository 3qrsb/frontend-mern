import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { getTopSellingProducts } from "../../../redux/products/slice-list";
import Loader from "../../UI/loader";
import TopSellingChart from "./TopSellingChart";

const TopSellingProducts: React.FC = () => {
  const dispatch = useAppDispatch();
  const { topSellingProducts = [], loading } = useAppSelector(
    (state) => state.productList
  );

  useEffect(() => {
    dispatch(getTopSellingProducts());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <TopSellingChart topSellingProducts={topSellingProducts} />
    </Box>
  );
};

export default TopSellingProducts;
