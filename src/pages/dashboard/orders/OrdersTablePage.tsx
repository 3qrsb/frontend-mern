import React, { useEffect, useState } from "react";
import { Box, Card } from "@mui/material";
import Loader from "../../../components/UI/loader";
import DataTable, { Column } from "../../../components/UI/DataTable";
import OrderRow from "./OrderRow";
import ConfirmationDialog from "../../../components/UI/ConfirmationDialog";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { getOrdersList, deleteOrder } from "../../../redux/orders/slice-list";
import toast from "react-hot-toast";
import { Order } from "../../../types/order";
import Paginate from "../../../components/UI/paginate";

const columns: Column[] = [
  { label: "Order ID", key: "orderId" },
  { label: "Email", key: "Email" },
  { label: "Total Price", key: "totalPrice" },
  { label: "Address", key: "address" },
  { label: "Status", key: "status" },
  { label: "Created At", key: "createdAt" },
  { label: "Options", key: "options" },
];

const OrdersTablePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleDeleteClick = (order: Order) => {
    setSelectedOrder(order);
    setConfirmationOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedOrder) {
      try {
        await dispatch(deleteOrder(selectedOrder._id)).unwrap();
        toast.success("Order has been deleted");
      } catch (error) {}
    }
    setConfirmationOpen(false);
    setSelectedOrder(null);
  };

  const handleCancel = () => {
    setConfirmationOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    dispatch(getOrdersList());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <DataTable columns={columns}>
          {orders.map((order: Order) => (
            <OrderRow
              key={order._id}
              order={order}
              onDelete={handleDeleteClick}
            />
          ))}
        </DataTable>
      )}
      <Box>
        <Paginate
          isAdmin={true}
          keyword={""}
          urlPrefix="/dashboard/orders"
          pages={0}
          page={0}
        />
      </Box>
      <ConfirmationDialog
        open={confirmationOpen}
        title="Confirm Delete"
        content={`Are you sure you want to delete the order for ${
          selectedOrder?.cartItems?.[0]?.name || "this order"
        }?`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default OrdersTablePage;
