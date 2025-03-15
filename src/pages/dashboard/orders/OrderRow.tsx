import React from "react";
import { TableRow, TableCell, Box, IconButton, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getDate } from "../../../utils/helper";
import { formatShippingAddress } from "../../../utils/helper";
import { formatCurrency } from "../../../utils/currencyUtils";
import { Order } from "../../../types/order";
import { useCurrencyData } from "../../../hooks/useCurrencyData";

interface OrderRowProps {
  order: Order;
  onDelete: (order: Order) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, onDelete }) => {
  const { currency, rates, baseCurrency } = useCurrencyData();
  return (
    <TableRow
      hover
      sx={{
        "&:nth-of-type(even)": { backgroundColor: "#f5f5f5" },
        transition: "background-color 0.3s",
      }}
    >
      <TableCell sx={{ color: "gray" }}>{order._id}</TableCell>
      <TableCell sx={{ color: "gray" }}>
        {typeof order.user === "object" && order.user !== null
          ? (order.user as { email: string }).email
          : order.user || "N/A"}
      </TableCell>
      <TableCell sx={{ color: "gray" }}>
        {formatCurrency(order.totalPrice, currency, rates, baseCurrency)}
      </TableCell>
      <TableCell sx={{ color: "gray" }}>
        {formatShippingAddress(order.shippingAddress)}
      </TableCell>
      <TableCell sx={{ color: "gray" }}>
        {order.isPaid ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        )}
      </TableCell>
      <TableCell sx={{ color: "gray" }}>
        {getDate(new Date(order.createdAt))}
      </TableCell>
      <TableCell>
        <Box display="flex" gap={1}>
          <Tooltip title="View Order">
            <IconButton
              component={Link}
              to={`/orders/${order._id}`}
              size="small"
              sx={{
                backgroundColor: "#bdbdbd",
                color: "white",
                "&:hover": { backgroundColor: "#757575" },
                borderRadius: 2,
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Order">
            <IconButton
              onClick={() => onDelete(order)}
              size="small"
              sx={{
                backgroundColor: "#ef5350",
                color: "white",
                "&:hover": { backgroundColor: "#c62828" },
                borderRadius: 2,
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default OrderRow;
