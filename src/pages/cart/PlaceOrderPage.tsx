import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  List,
  ListItem,
  Box,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DefaultLayout from "../../components/layouts/default/DefaultLayout";
import { useAppSelector, useAppDispatch } from "../../redux";
import { loadStripe } from "@stripe/stripe-js";
import authAxios from "../../utils/auth-axios";
import toast from "react-hot-toast";
import { saveAddress } from "../../redux/cart/cart-slice";
import AddressSelectorModal from "../../components/checkout/AddressSelectorModal";
import { formatCurrency } from "../../utils/currencyUtils";
import { useCurrencyData } from "../../hooks/useCurrencyData";

const stripePromise = loadStripe(import.meta.env.VITE_API_STRIPE);

const PlaceOrderPage = () => {
  const { shippingAddress, cartItems } = useAppSelector((state) => state.cart);
  const { userInfo } = useAppSelector((state) => state.login);
  const dispatch = useAppDispatch();
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const { currency, rates, baseCurrency } = useCurrencyData();
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );
  const totalPrice = itemsPrice;

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      toast.error("Please select a shipping address.");
      return;
    }
    const orderPayload = {
      items: cartItems.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.images[0],
      })),
      shippingAddress,
      totalPrice,
    };

    try {
      const response = await authAxios.post(
        "/stripe/create-checkout-session",
        orderPayload
      );
      const { id: sessionId } = response.data;
      if (sessionId) {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe failed to initialize.");
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) throw new Error(error.message);
      }
    } catch (error: any) {
      toast.error(
        error.message || "Payment initiation failed. Please try again."
      );
    }
  };

  return (
    <DefaultLayout title="Checkout">
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Review &amp; Place Your Order
        </Typography>
        <Grid container spacing={3}>
          {/* Shipping Address Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              variant="outlined"
              sx={{ borderColor: "grey.300", boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                {shippingAddress ? (
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "grey.300",
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1">
                      {shippingAddress.street}
                      {shippingAddress.apartment &&
                        `, ${shippingAddress.apartment}`}
                    </Typography>
                    <Typography variant="body2">
                      {shippingAddress.city}
                      {shippingAddress.state && `, ${shippingAddress.state}`}
                    </Typography>
                    <Typography variant="body2">
                      {shippingAddress.country}, {shippingAddress.postalCode}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body1" color="error">
                    No shipping address selected.
                  </Typography>
                )}
                <Button
                  data-testid="select-address-button"
                  variant="outlined"
                  onClick={() => setAddressModalOpen(true)}
                  sx={{ mt: 1 }}
                >
                  Select / Add Address
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Summary Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              variant="outlined"
              sx={{ borderColor: "grey.300", boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <List sx={{ py: 0 }}>
                  <ListItem disableGutters>
                    <Typography>
                      SubTotal (
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
                      items):{" "}
                      {formatCurrency(
                        itemsPrice,
                        currency,
                        rates,
                        baseCurrency
                      )}
                    </Typography>
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                  <ListItem disableGutters>
                    <Typography>
                      Tax Price:{" "}
                      {formatCurrency(0, currency, rates, baseCurrency)}
                    </Typography>
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                  <ListItem disableGutters>
                    <Typography>
                      Shipping Price:{" "}
                      {formatCurrency(0, currency, rates, baseCurrency)}
                    </Typography>
                  </ListItem>
                  <Divider sx={{ my: 1 }} />
                  <ListItem disableGutters>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Final Price:{" "}
                      {formatCurrency(
                        totalPrice,
                        currency,
                        rates,
                        baseCurrency
                      )}
                    </Typography>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            data-testid="place-order-button"
            variant="contained"
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0}
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              fontWeight: "bold",
              backgroundColor: "primary.main",
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            Place Order &amp; Pay
          </Button>
        </Box>
      </Container>

      <AddressSelectorModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        userId={userInfo?._id || ""}
        onAddressSelected={(address) => {
          dispatch(saveAddress(address));
          setAddressModalOpen(false);
        }}
      />
    </DefaultLayout>
  );
};

export default PlaceOrderPage;
