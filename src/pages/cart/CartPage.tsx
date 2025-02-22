import React from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DefaultLayout from "../../components/layouts/default/DefaultLayout";
import { useAppSelector, useAppDispatch } from "../../redux";
import { formatCurrencry } from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LazyImage from "../../components/UI/LazyImage";
import { updateCart, removeFromCart } from "../../redux/cart/cart-slice";
import QuantityField from "../../components/UI/QuantityField";
import CloseIcon from "@mui/icons-material/Close";

const CartPage: React.FC = () => {
  const { cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (item: any, newQty: number) => {
    if (newQty < 1 || newQty > item.availableQty) {
      toast.error(`Quantity must be between 1 and ${item.availableQty}`);
      return;
    }
    dispatch(updateCart({ product: item, qty: newQty }));
  };

  const handleDeleteItem = (item: any) => {
    dispatch(removeFromCart({ product: item, deleteAll: true }));
    toast.success("Item removed from cart.");
  };

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );
  const taxPrice = 0;
  const shippingPrice = itemsPrice >= 200 ? 0 : 30;
  const finalPrice = itemsPrice + taxPrice + shippingPrice;

  return (
    <DefaultLayout title="Cart">
      <Container sx={{ py: 4 }}>
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="h6" sx={{ mt: 4 }}>
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/products"
              sx={{ mt: 3 }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ overflowX: "auto", p: 2 }}>
                <Box sx={{ minWidth: 600 }}>
                  <Box
                    sx={{
                      mb: 2,
                      p: 1,
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid
                        size={{ xs: 2, md: 1 }}
                        sx={{ textAlign: "center" }}
                      >
                      </Grid>
                      <Grid
                        size={{ xs: 3, md: 2 }}
                        sx={{ textAlign: "center" }}
                      >
                        <Typography variant="subtitle2">Image</Typography>
                      </Grid>
                      <Grid
                        size={{ xs: 4, md: 4 }}
                        sx={{ textAlign: "center" }}
                      >
                        <Typography variant="subtitle2">Title</Typography>
                      </Grid>
                      <Grid
                        size={{ xs: 2, md: 3 }}
                        sx={{ textAlign: "center" }}
                      >
                        <Typography variant="subtitle2">Quantity</Typography>
                      </Grid>
                      <Grid
                        size={{ xs: 1, md: 2 }}
                        sx={{ textAlign: "center" }}
                      >
                        <Typography variant="subtitle2">Price</Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  {cartItems.map((item) => (
                    <Card
                      key={item._id}
                      sx={{ mb: 2, p: 2, boxShadow: 3, mx: 2 }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid
                          size={{ xs: 2, md: 1 }}
                          sx={{ textAlign: "center" }}
                        >
                          <IconButton onClick={() => handleDeleteItem(item)}>
                            <CloseIcon />
                          </IconButton>
                        </Grid>
                        <Grid
                          size={{ xs: 3, md: 2 }}
                          sx={{ textAlign: "center" }}
                        >
                          <LazyImage
                            imageUrl={item.images[0]}
                            sx={{
                              width: "100%",
                              objectFit: "contain",
                              borderRadius: 1,
                            }}
                          />
                        </Grid>
                        <Grid
                          size={{ xs: 4, md: 4 }}
                          sx={{ textAlign: "center" }}
                        >
                          <Typography variant="subtitle1">
                            {item.name}
                          </Typography>
                        </Grid>
                        <Grid
                          size={{ xs: 2, md: 3 }}
                          sx={{ textAlign: "center" }}
                        >
                          <QuantityField
                            value={item.qty}
                            min={1}
                            max={item.availableQty}
                            onChange={(newQty) =>
                              handleQuantityChange(item, newQty)
                            }
                          />
                        </Grid>
                        <Grid
                          size={{ xs: 1, md: 2 }}
                          sx={{ textAlign: "center" }}
                        >
                          <Typography variant="subtitle1">
                            {formatCurrencry(item.price * item.qty)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <List sx={{ py: 0 }}>
                    <ListItem disableGutters>
                      <Typography>
                        SubTotal (
                        {cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
                        items): {formatCurrencry(itemsPrice)}
                      </Typography>
                    </ListItem>
                    <Divider sx={{ my: 1 }} />
                    <ListItem disableGutters>
                      <Typography>
                        Tax Price: {formatCurrencry(taxPrice)}
                      </Typography>
                    </ListItem>
                    <Divider sx={{ my: 1 }} />
                    <ListItem disableGutters>
                      <Typography>
                        Shipping Price: {formatCurrencry(shippingPrice)}
                      </Typography>
                    </ListItem>
                    <Divider sx={{ my: 1 }} />
                    <ListItem disableGutters>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Final Price: {formatCurrencry(finalPrice)}
                      </Typography>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/place-order")}
                  disabled={cartItems.length === 0}
                  size="large"
                  fullWidth
                >
                  Place Order
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/"
                  fullWidth
                  sx={{ mt: 2 }}
                  size="large"
                >
                  Continue Shopping
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </DefaultLayout>
  );
};

export default CartPage;
