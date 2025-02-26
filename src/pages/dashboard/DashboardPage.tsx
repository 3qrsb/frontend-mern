import { useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux";
import { getOrdersList } from "../../redux/orders/slice-list";
import { getNewCustomersThisMonth } from "../../redux/users/user-list";
import { getDate } from "../../utils/helper";
import React from "react";
import SalesTrends from "../../components/admin-dashboard/SalesTrends";
import TopSellingProducts from "../../components/admin-dashboard/TopSellingProducts";
import {
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  ShowChart as ShowChartIcon,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { formatCurrency } from "../../utils/currencyUtils";
import { useCurrencyData } from "../../hooks/useCurrencyData";

const DashboardPage = () => {
  const { total } = useAppSelector((state) => state.productFilter);
  const { orders = [] } = useAppSelector((state) => state.orders);
  const { users = [], newCustomers = 0 } = useAppSelector(
    (state) => state.userList
  );
  const dispatch = useAppDispatch();
  const { currency, rates, baseCurrency } = useCurrencyData();

  const getTotalCost = () => {
    let total = 0;
    if (!orders) return 500.3;
    orders.map((item: any) => {
      if (!item) return;
      total += item.totalPrice;
    });
    return total;
  };

  const getAverageOrderValue = () => {
    if (!orders || orders.length === 0) return 0;
    return getTotalCost() / orders.length;
  };

  const totalPrice = getTotalCost();
  const averageOrderValue = getAverageOrderValue();

  useEffect(() => {
    dispatch(getOrdersList());
    dispatch(getNewCustomersThisMonth());
  }, [dispatch]);

  return (
    <Row className="g-3 my-6 mt-3">
      <Col md={4}>
        <Card className=" shadow border-0">
          <Card.Body>
            <Row>
              <Col>
                <span className="h6 font-semibold text-muted text-sm d-block mb-2">
                  Revenue
                </span>
                <span className="h3 font-bold mb-0">
                  {formatCurrency(totalPrice, currency, rates, baseCurrency)}
                </span>
              </Col>
              <div className="col-auto">
                <div className="icon icon-shape bg-tertiary text-white text-lg rounded-circle">
                  <i className="bi bi-credit-card" />
                </div>
              </div>
            </Row>
            <div className="mt-2 mb-0 text-sm">
              <span className="badge badge-pill bg-soft-success text-success me-2">
                <i className="bi bi-arrow-up me-1" />
                13%
              </span>
              <span className="text-nowrap text-xs text-muted">
                Since last month
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className=" shadow border-0">
          <Card.Body>
            <Row>
              <Col>
                <span className="h6 font-semibold text-muted text-sm d-block mb-2">
                  Clients
                </span>
                <span className="h3 font-bold mb-0">
                  {users?.length && users?.length}
                </span>
              </Col>
              <div className="col-auto">
                <div className="icon icon-shape bg-primary text-white text-lg rounded-circle">
                  <i className="bi bi-people" />
                </div>
              </div>
            </Row>
            <div className="mt-2 mb-0 text-sm">
              <span className="badge badge-pill bg-soft-success text-success me-2">
                <i className="bi bi-arrow-up me-1" />
                30%
              </span>
              <span className="text-nowrap text-xs text-muted">
                Since last month
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className=" shadow border-0">
          <Card.Body>
            <Row>
              <Col>
                <span className="h6 font-semibold text-muted text-sm d-block mb-2">
                  Products
                </span>
                <span className="h3 font-bold mb-0">{total}</span>
              </Col>
              <div className="col-auto">
                <div className="icon icon-shape bg-info text-white text-lg rounded-circle">
                  <i className="bi bi-clock-history" />
                </div>
              </div>
            </Row>
            <div className="mt-2 mb-0 text-sm">
              <span className="badge badge-pill bg-soft-danger text-danger me-2">
                <i className="bi bi-arrow-down me-1" />
                -5%
              </span>
              <span className="text-nowrap text-xs text-muted">
                Since last month
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className=" shadow border-0">
          <Card.Body>
            <Row>
              <Col>
                <span className="h6 font-semibold text-muted text-sm d-block mb-2">
                  Orders
                </span>
                <span className="h3 font-bold mb-0">
                  {orders?.length && orders?.length}
                </span>
              </Col>
              <div className="col-auto">
                <div className="icon icon-shape bg-success text-white text-lg rounded-circle">
                  <i className="bi bi-cart" />
                </div>
              </div>
            </Row>
            <div className="mt-2 mb-0 text-sm">
              <span className="badge badge-pill bg-soft-success text-success me-2">
                <i className="bi bi-arrow-up me-1" />
                20%
              </span>
              <span className="text-nowrap text-xs text-muted">
                Since last month
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className=" shadow border-0">
          <Card.Body>
            <Row>
              <Col>
                <span className="h6 font-semibold text-muted text-sm d-block mb-2">
                  Average Order Value
                </span>
                <span className="h3 font-bold mb-0">
                  {formatCurrency(averageOrderValue)}
                </span>
              </Col>
              <div className="col-auto">
                <div className="icon icon-shape bg-warning text-white text-lg rounded-circle">
                  <i className="bi bi-graph-up" />
                </div>
              </div>
            </Row>
            <div className="mt-2 mb-0 text-sm">
              <span className="badge badge-pill bg-soft-success text-success me-2">
                <i className="bi bi-arrow-up me-1" />
                10%
              </span>
              <span className="text-nowrap text-xs text-muted">
                Since last month
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="shadow border-0">
          <Card.Body>
            <Row>
              <Col>
                <span className="h6 font-semibold text-muted text-sm d-block mb-2">
                  New Customers This Month
                </span>
                <span className="h3 font-bold mb-0">{newCustomers}</span>
              </Col>
              <div className="col-auto">
                <div className="icon icon-shape bg-info text-white text-lg rounded-circle">
                  <i className="bi bi-person-plus" />
                </div>
              </div>
            </Row>
            <div className="mt-2 mb-0 text-sm">
              <span className="badge badge-pill bg-soft-success text-success me-2">
                <i className="bi bi-arrow-up me-1" />
                10%
              </span>
              <span className="text-nowrap text-xs text-muted">
                Since last month
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} className="mt-7">
        <Card className="shadow border-0">
          <Card.Body>
            <Box display="flex" alignItems="center" mb={2}>
              <ReceiptIcon style={{ color: "#1976d2", marginRight: "10px" }} />
              <Typography variant="h5" color="primary">
                Recent Orders
              </Typography>
            </Box>
            <List>
              {orders.slice(0, 5).map((order: any) => (
                <React.Fragment key={order._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography variant="body1" color="textPrimary">
                          Order ID: {order._id}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            Email: {order.user.email}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            Total: {formatCurrency(order.totalPrice, currency, rates, baseCurrency)}
                          </Typography>
                          <br />
                          {order.discountAmount && (
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                              >
                                Discount Amount:{" "}
                                {formatCurrency(order.discountAmount)}
                              </Typography>
                              <br />
                            </>
                          )}
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                          >
                            Date: {getDate(new Date(order.createdAt))}
                          </Typography>
                          <br />
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} className="mt-7">
        <Card className="shadow border-0">
          <Card.Body>
            <Box display="flex" alignItems="center" mb={2}>
              <ShowChartIcon
                style={{ color: "#1976d2", marginRight: "10px" }}
              />
              <Typography variant="h5" color="primary">
                Sales Trends
              </Typography>
            </Box>
            <SalesTrends />
          </Card.Body>
        </Card>
      </Col>
      <Col md={12} className="mt-4">
        <TopSellingProducts />
      </Col>
    </Row>
  );
};

export default DashboardPage;
