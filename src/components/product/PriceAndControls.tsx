import React from "react";
import {
  Card,
  List,
  ListItem,
  Typography,
  Divider,
  Button,
  Box,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import { formatCurrency } from "../../utils/currencyUtils";
import { Product } from "../../types/product";

interface PriceAndControlsProps {
  product: Product;
  currency: string;
  rates: any;
  baseCurrency: string;
  isProductInCart: boolean;
  onAdd: () => void;
  screenSize: boolean;
  isLiked: boolean;
  handleLike: () => void;
}

const PriceAndControls: React.FC<PriceAndControlsProps> = ({
  product,
  currency,
  rates,
  baseCurrency,
  isProductInCart,
  onAdd,
  screenSize,
  isLiked,
  handleLike,
}) => (
  <Card sx={{ boxShadow: 3, p: 2, position: "sticky", top: "20px" }}>
    <List>
      <ListItem>
        <Typography variant="h4" color="primary">
          {formatCurrency(product.price, currency, rates, baseCurrency)}
        </Typography>
      </ListItem>
      <Divider />
      <ListItem>
        <Typography variant="body1">Payment via Stripe</Typography>
      </ListItem>
      <Divider />
      <ListItem>
        <Button
          variant="contained"
          color="primary"
          onClick={onAdd}
          fullWidth
          sx={{ mt: 1 }}
          disabled={!product.inStock || isProductInCart}
        >
          {isProductInCart ? "Already in Cart" : "Add to Cart"}
        </Button>
      </ListItem>
      <ListItem>
        <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLike}
            sx={{
              flex: 1,
              mr: 1,
              display: "flex",
              flexDirection: screenSize ? "column" : "row",
              alignItems: "center",
            }}
            startIcon={
              isLiked ? (
                <FavoriteIcon sx={{ color: "red" }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: "red" }} />
              )
            }
          >
            Like
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              flex: 1,
              ml: 1,
              display: "flex",
              flexDirection: screenSize ? "column" : "row",
              alignItems: "center",
            }}
            startIcon={<ShareIcon />}
          >
            Share
          </Button>
        </Box>
      </ListItem>
      <Divider />
      <ListItem>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            mt: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mx: 1,
            }}
          >
            <SecurityIcon sx={{ fontSize: 30, color: "#1976d2" }} />
            <Typography
              variant="body2"
              sx={{ textAlign: "center", fontSize: "0.75rem" }}
            >
              Secure Checkout
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mx: 1,
            }}
          >
            <MonetizationOnIcon sx={{ fontSize: 30, color: "#1976d2" }} />
            <Typography
              variant="body2"
              sx={{ textAlign: "center", fontSize: "0.75rem" }}
            >
              Money-Back Guarantee
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mx: 1,
            }}
          >
            <LocalShippingIcon sx={{ fontSize: 30, color: "#1976d2" }} />
            <Typography
              variant="body2"
              sx={{ textAlign: "center", fontSize: "0.75rem" }}
            >
              Free Shipping
            </Typography>
          </Box>
        </Box>
      </ListItem>
    </List>
  </Card>
);

export default PriceAndControls;
