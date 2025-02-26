import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { formatCurrency, getDate } from "../../utils/helper";
import { Ordertypes } from "../../types/order";

interface UserOrdersTableProps {
  orders: Ordertypes[];
  onDelete: (orderId: string) => void;
}

const UserOrdersTable: React.FC<UserOrdersTableProps> = ({
  orders,
  onDelete,
}) => {
  const cols = ["Order id", "Price", "Address", "Paid", "Date", "Actions"];

  return (
    <TableContainer
      component={Paper}
      sx={{ width: "100%", overflowX: "auto", mb: 2 }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="orders table">
        <TableHead sx={{ backgroundColor: "#c62828" }}>
          <TableRow>
            {cols.map((col) => (
              <TableCell
                key={col}
                sx={{
                  color: "white",
                  textTransform: "uppercase",
                  fontWeight: "normal",
                  fontSize: "inherit",
                  py: 1,
                  px: 2,
                }}
              >
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell sx={{ color: "gray", fontSize: "inherit" }}>
                {order._id}
              </TableCell>
              <TableCell sx={{ color: "gray", fontSize: "inherit" }}>
                {formatCurrency(order.totalPrice)}
              </TableCell>
              <TableCell sx={{ color: "gray", fontSize: "inherit" }}>
                {order.shippingAddress.street}
                {order.shippingAddress.apartment &&
                  `, ${order.shippingAddress.apartment}`}
                <br />
                {order.shippingAddress.city}
                {order.shippingAddress.state &&
                  `, ${order.shippingAddress.state}`}
                <br />
                {order.shippingAddress.country},{" "}
                {order.shippingAddress.postalCode}
              </TableCell>
              <TableCell sx={{ color: "gray", fontSize: "inherit" }}>
                {order.isPaid ? (
                  <FaCheck color="green" />
                ) : (
                  <FaTimes color="red" />
                )}
              </TableCell>
              <TableCell sx={{ color: "gray", fontSize: "inherit" }}>
                {getDate(new Date(order.createdAt))}
              </TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    gap: { xs: 1, sm: 1 },
                  }}
                >
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
                    <GrView />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(order._id)}
                    size="small"
                    sx={{
                      backgroundColor: "#ef5350",
                      color: "white",
                      "&:hover": { backgroundColor: "#c62828" },
                      borderRadius: 2,
                    }}
                  >
                    <FaTrash />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserOrdersTable;
