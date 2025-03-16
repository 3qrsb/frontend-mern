import React from "react";
import {
  Card,
  List,
  ListItem,
  Typography,
  Divider,
  ListItemText,
  Box,
  Rating,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ReviewIcon from "@mui/icons-material/RateReview";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Product } from "../../types/product";

interface ProductInfoCardProps {
  product: Product;
  averageRating: number;
}

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({
  product,
  averageRating,
}) => (
  <Card sx={{ boxShadow: 3, p: 2 }}>
    <List>
      <ListItem>
        <Typography variant="h5">{product.name}</Typography>
      </ListItem>
      <Divider />
      <ListItem>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Rating
            name="read-only"
            value={averageRating}
            readOnly
            precision={0.5}
            icon={<StarIcon fontSize="inherit" />}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
          />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {averageRating.toFixed(1)}
          </Typography>
        </Box>
      </ListItem>
      <ListItem>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ReviewIcon sx={{ mr: 0.5, fontSize: 20, color: "#1976d2" }} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {product.reviews.length} Reviews
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ShoppingCartIcon
              sx={{ mr: 0.5, fontSize: 20, color: "#1976d2" }}
            />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {product.totalSales} Orders
            </Typography>
          </Box>
        </Box>
      </ListItem>
      <ListItem>
        <Typography
          variant="body2"
          sx={{
            color:
              product.qty === 0 ? "red" : product.qty <= 10 ? "red" : "green",
          }}
        >
          {product.qty === 0
            ? "Out of Stock"
            : product.qty <= 10
            ? `Only ${product.qty} items left!`
            : "In Stock"}
        </Typography>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary="Brand:" secondary={product.brand} />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary="Category:" secondary={product.category} />
      </ListItem>
      <Divider />
      <ListItem>
        <Typography variant="body1">{product.description}</Typography>
      </ListItem>
    </List>
  </Card>
);

export default ProductInfoCard;
