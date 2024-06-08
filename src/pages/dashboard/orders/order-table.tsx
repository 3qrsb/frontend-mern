import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { getOrdersList } from "../../../redux/orders/slice-list";
import authAxios from "../../../utils/auth-axios";
import { setError } from "../../../utils/error";
import { formatCurrencry, getDate } from "../../../utils/helper";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import Loader from "../../../components/UI/loader";
import toast from "react-hot-toast";
import { GrView } from "react-icons/gr";

function OrdersTable() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const [refresh, setRefresh] = useState<boolean>(false);

  const onDelete = (id: string | number, productName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the order for ${productName}?`
      )
    ) {
      authAxios
        .delete(`/orders/${id}`)
        .then((res) => {
          toast.success(res.data);
          setRefresh((prev) => !prev);
        })
        .catch((e) => toast.error(setError(e)));
    }
  };

  const handleDelete = (order: { _id: any; cartItems: { name: any }[] }) => {
    const productName = order.cartItems[0].name; // Assuming you want to use the first item's name
    onDelete(order._id, productName);
  };

  useEffect(() => {
    dispatch(getOrdersList());
  }, [dispatch, refresh]);

  const cols = [
    "Order ID",
    "User Email",
    "Total Price",
    "Address",
    "Status",
    "Created At",
    "Options",
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Card className="mt-5">
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#c62828" }}>
                <TableRow>
                  {cols.map((col: any) => (
                    <TableCell
                      key={col}
                      sx={{
                        color: "white",
                        textTransform: "uppercase",
                        fontWeight: "normal",
                        fontSize: "0.875rem",
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
                {orders.map((order: any) => (
                  <TableRow key={order._id}>
                    <TableCell sx={{ color: "gray" }}>{order._id}</TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {order.user.email}
                    </TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {formatCurrencry(order.totalPrice)}
                    </TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {order.shippingAddress.address}
                    </TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {order.isPaid ? (
                        <FaCheck color="green" />
                      ) : (
                        <FaTimes color="red" />
                      )}
                    </TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {getDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/orders/${order._id}`}
                        size="small"
                        sx={{
                          backgroundColor: "#bdbdbd",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#757575",
                          },
                          mr: 1,
                          borderRadius: 2,
                        }}
                      >
                        <GrView />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(order)}
                        size="small"
                        sx={{
                          backgroundColor: "#ef5350",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#c62828",
                          },
                          ml: 1,
                          borderRadius: 2,
                        }}
                      >
                        <FaTrash />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </>
  );
}

export default OrdersTable;
