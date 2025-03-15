import React, { useEffect } from "react";
import { Box, Card, CardContent, Typography, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useAppDispatch, useAppSelector } from "../../redux";
import { getOrdersList } from "../../redux/orders/slice-list";
import { getNewCustomersThisMonth } from "../../redux/users/user-list";
import SalesTrends from "../../components/admin-dashboard/sales-trends/SalesTrends";
import TopSellingProducts from "../../components/admin-dashboard/top-selling/TopSellingProducts";
import DashboardMetricCard from "../../components/admin-dashboard/DashboardMetricCard";
import RecentOrdersCard from "../../components/admin-dashboard/RecentOrdersCard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TimelineIcon from "@mui/icons-material/Timeline";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Receipt from "@mui/icons-material/Receipt";
import { formatCurrency } from "../../utils/currencyUtils";
import { useCurrencyData } from "../../hooks/useCurrencyData";
import Loader from "../../components/UI/loader";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { orders = [], loading } = useAppSelector((state) => state.orders);
  const { users = [], newCustomers = 0 } = useAppSelector(
    (state) => state.userList
  );
  const { total } = useAppSelector((state) => state.productFilter);
  const { currency, rates, baseCurrency } = useCurrencyData();
  const totalCost = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const averageOrderValue = orders.length ? totalCost / orders.length : 0;

  useEffect(() => {
    dispatch(getOrdersList());
    dispatch(getNewCustomersThisMonth());
  }, [dispatch]);

  if (loading) return <Loader />;

  const dashboardMetrics = [
    {
      title: "Revenue",
      value: formatCurrency(totalCost, currency, rates, baseCurrency),
      icon: <MonetizationOnIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      percentageChange: 13,
      size: { xs: 12, md: 4 },
    },
    {
      title: "Clients",
      value: users.length,
      icon: <PeopleIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      percentageChange: 30,
      size: { xs: 12, md: 4 },
    },
    {
      title: "Products",
      value: total,
      icon: <StorefrontIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      percentageChange: -5,
      size: { xs: 12, md: 4 },
    },
    {
      title: "Orders",
      value: orders.length,
      icon: <ShoppingCartIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      percentageChange: 20,
      size: { xs: 12, md: 4 },
    },
    {
      title: "Average Order Value",
      value: formatCurrency(averageOrderValue, currency, rates, baseCurrency),
      icon: <BarChartIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      percentageChange: 10,
      size: { xs: 12, md: 4 },
    },
    {
      title: "New Customers This Month",
      value: newCustomers,
      icon: <PersonAddIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      percentageChange: 10,
      size: { xs: 12, md: 4 },
    },
  ];

  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={3}>
        {dashboardMetrics.map((metric, index) => (
          <Grid size={metric.size} key={index}>
            <DashboardMetricCard
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              percentageChange={metric.percentageChange}
            />
          </Grid>
        ))}
        <Grid size={12}>
          <Card sx={{ boxShadow: 3, width: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Receipt sx={{ color: "#1976d2", mr: 1 }} />
                <Typography variant="h5" color="primary">
                  Recent Orders
                </Typography>
              </Box>
              <Divider />
              <RecentOrdersCard orders={orders} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={12}>
          <Card sx={{ boxShadow: 3, width: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TimelineIcon sx={{ color: "#1976d2", mr: 1 }} />
                <Typography variant="h5" color="primary">
                  Sales Trends
                </Typography>
              </Box>
              <Divider />
              <SalesTrends />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={12}>
          <Card sx={{ boxShadow: 3, width: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <LocalOfferIcon sx={{ color: "#1976d2", mr: 1 }} />
                <Typography variant="h5" color="primary">
                  Top Selling Products
                </Typography>
              </Box>
              <Divider />
              <TopSellingProducts />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
