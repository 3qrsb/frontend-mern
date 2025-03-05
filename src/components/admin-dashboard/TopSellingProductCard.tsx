import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Divider,
} from "@mui/material";
import { formatCurrency } from "../../utils/currencyUtils";
import { useCurrencyData } from "../../hooks/useCurrencyData";
import { Product } from "../../types/product";

interface TopSellingProductCardProps {
  product: Product;
}

const TopSellingProductCard: React.FC<TopSellingProductCardProps> = ({
  product,
}) => {
  const { currency, rates, baseCurrency } = useCurrencyData();

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            variant="rounded"
            src={product.images && product.images[0]}
            alt={product.name}
            sx={{ width: 60, height: 60 }}
          />
          <Box flex={1}>
            <Typography variant="h6" noWrap>
              {product.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {product.totalSales} sales
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" color="textSecondary">
          Price: {formatCurrency(product.price, currency, rates, baseCurrency)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TopSellingProductCard;
