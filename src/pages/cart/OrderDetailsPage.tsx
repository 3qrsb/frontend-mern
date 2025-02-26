import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux";
import { getOrderById } from "../../redux/orders/order-details";
import DefaultLayout from "../../components/layouts/default/DefaultLayout";
import Loader from "../../components/UI/loader";
import { formatCurrency } from "../../utils/helper";
import LazyImage from "../../components/UI/LazyImage";
import Grid from "@mui/material/Grid2";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const OrderDetailsPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { order, loading } = useAppSelector((state) => state.orderDetail);

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  if (!loading && !order) {
    return (
      <DefaultLayout title="Order Details">
        <Container sx={{ py: 3 }}>
          <Typography variant="h6">
            Order is processing. Please check back shortly.
          </Typography>
        </Container>
      </DefaultLayout>
    );
  }

  const cartItemCount =
    order?.cartItems.reduce((acc, item) => acc + item.qty, 0) || 0;
  const cartSubTotal =
    order?.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) || 0;
  const shippingCost = order?.totalPrice ? order.totalPrice - cartSubTotal : 0;

  return (
    <DefaultLayout title="Order Details">
      <Container sx={{ py: 3 }}>
        {loading ? (
          <Loader />
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h5" fontWeight="bold">
                  Order #{order?._id?.slice(-6).toUpperCase()}
                </Typography>
                {order?.isPaid ? (
                  <Chip
                    label="Paid"
                    color="success"
                    icon={<CheckCircleIcon />}
                    sx={{ fontWeight: "bold" }}
                  />
                ) : (
                  <Chip
                    label="Unpaid"
                    color="warning"
                    icon={<ErrorIcon />}
                    sx={{ fontWeight: "bold" }}
                  />
                )}
              </Box>

              {order?.shippingAddress && (
                <Card elevation={3} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Shipping Address
                    </Typography>
                    <Typography variant="body1">
                      {order.shippingAddress.street},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.postalCode},{" "}
                      {order.shippingAddress.country}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Order Items */}
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Order Items
                  </Typography>
                  <List disablePadding>
                    {order?.cartItems.map((item) => (
                      <ListItem
                        key={item._id}
                        sx={{ display: "flex", alignItems: "center", py: 1 }}
                        divider
                      >
                        <ListItemAvatar>
                          <Avatar
                            variant="square"
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: 2,
                              bgcolor: "background.paper",
                              mr: 2,
                            }}
                          >
                            <LazyImage
                              imageUrl={item.image}
                              style={{ objectFit: "contain" }}
                              className="h-16 w-16"
                            />
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight="bold">
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              Quantity: {item.qty}
                            </Typography>
                          }
                          sx={{ flex: 1 }}
                        />

                        <Typography variant="body1" fontWeight="bold">
                          {formatCurrency(item.qty * item.price)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card elevation={3}>
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    align="center"
                    gutterBottom
                  >
                    Payment Details
                  </Typography>

                  <Stack spacing={2} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Subtotal ({cartItemCount} items)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(cartSubTotal)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Tax Price
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(0)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Shipping Price
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(shippingCost > 0 ? shippingCost : 0)}
                      </Typography>
                    </Box>

                    {order?.isPaid && order.discountAmount > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          Discount
                        </Typography>
                        <Typography variant="body2" color="error.main">
                          -{formatCurrency(order.discountAmount)}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      borderRadius: 1,
                      bgcolor: "grey.100",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Final Price
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {formatCurrency(order?.totalPrice)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </DefaultLayout>
  );
};

export default OrderDetailsPage;
