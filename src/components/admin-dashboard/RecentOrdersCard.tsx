import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Stack,
} from "@mui/material";
import { getDate } from "../../utils/helper";
import { formatCurrency } from "../../utils/currencyUtils";
import { useCurrencyData } from "../../hooks/useCurrencyData";
import { Ordertypes } from "../../types/order";

interface RecentOrdersCardProps {
  orders: Ordertypes[];
}

const RecentOrdersCard: React.FC<RecentOrdersCardProps> = ({ orders }) => {
  const { currency, rates, baseCurrency } = useCurrencyData();

  return (
    <List>
      {orders.slice(0, 5).map((order) => (
        <React.Fragment key={order._id}>
          <ListItem alignItems="flex-start">
            <ListItemText
              primary={
                <Typography variant="body1" color="textPrimary">
                  Order ID: {order._id}
                </Typography>
              }
              secondary={
                <Stack spacing={1}>
                  <Typography variant="body2" color="textPrimary">
                    Email:{" "}
                    {typeof order.user === "string"
                      ? order.user
                      : order.user.email}
                  </Typography>
                  <Typography variant="body2" color="textPrimary">
                    Total:{" "}
                    {formatCurrency(
                      order.totalPrice,
                      currency,
                      rates,
                      baseCurrency
                    )}
                  </Typography>
                  {order.discountAmount > 0 && (
                    <Typography variant="body2" color="textPrimary">
                      Discount:{" "}
                      {formatCurrency(
                        order.discountAmount,
                        currency,
                        rates,
                        baseCurrency
                      )}
                    </Typography>
                  )}
                  <Typography variant="body2" color="textSecondary">
                    Date: {getDate(new Date(order.createdAt))}
                  </Typography>
                </Stack>
              }
            />
          </ListItem>
          <Divider component="li" />
        </React.Fragment>
      ))}
    </List>
  );
};

export default RecentOrdersCard;
