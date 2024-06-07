import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Button,
  TextField,
  Card,
  Typography,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CardContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useParams } from "react-router-dom";
import DefaultLayout from "../../components/layouts/default-layout";
import Loader from "../../components/UI/loader";
import { useAppDispatch, useAppSelector } from "../../redux";
import { getUserBydId } from "../../redux/users/user-details";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import authAxios from "../../utils/auth-axios";
import toast from "react-hot-toast";
import { setError } from "../../utils/error";
import { getUserOrder } from "../../redux/orders/user-orders";
import { formatCurrencry, getDate } from "../../utils/helper";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { GrView } from "react-icons/gr";

type FormValues = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
};

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.userDetails);
  const { orders, loading: orderLoading } = useAppSelector(
    (state) => state.userOrder
  );
  const { id } = useParams();
  const [refresh, setRefresh] = useState<boolean>(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string(),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords do not match"
    ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: FormValues) => {
    const update = {
      name: data.name,
      email: data.email,
      password: data.password === "" ? null : data.password,
    };
    authAxios
      .put(`/users/${user?._id}`, update)
      .then((res) => {
        toast.success("user has been updated");
        setRefresh((prev) => (prev = !prev));
      })
      .catch((err) => toast.error(setError(err)));
  };

  const onDelete = (id: string | number) => {
    if (window.confirm("It will delete this order from your account!")) {
      authAxios
        .delete(`/orders/${id}`)
        .then((res) => {
          toast.success(res.data);
          setRefresh((prev) => (prev = !prev));
        })
        .catch((e) => toast.error(setError(e)));
    }
  };

  useEffect(() => {
    dispatch(getUserBydId(id));
    dispatch(getUserOrder());
  }, [dispatch, id, refresh]);

  const cols = ["Order id", "Price", "Address", "Paid", "Date", "Options"];

  return (
    <DefaultLayout title={`${user?.name} profile`}>
      <Container>
        {loading || !user || orderLoading || !orders ? (
          <Loader />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} className="mt-5 mb-5">
              <Card sx={{ p: 3 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Typography variant="h6" gutterBottom>
                    Profile Details
                  </Typography>
                  <TextField
                    fullWidth
                    label="Username"
                    {...register("name", { value: user?.name })}
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    {...register("email", { value: user?.email })}
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    {...register("password")}
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    {...register("confirmPassword")}
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                  >
                    Update
                  </Button>
                </form>
              </Card>
            </Grid>
            <Grid item xs={12} md={8} className="mt-5 mb-5">
              <Card>
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
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell sx={{ color: "gray" }}>
                            {order._id}
                          </TableCell>
                          <TableCell sx={{ color: "gray" }}>
                            {formatCurrencry(order?.totalPrice)}
                          </TableCell>
                          <TableCell sx={{ color: "gray" }}>
                            {order?.shippingAddress?.address}
                          </TableCell>
                          <TableCell sx={{ color: "gray" }}>
                            {order.isPaid ? (
                              <FaCheck color="green" />
                            ) : (
                              <FaTimes color="red" />
                            )}
                          </TableCell>
                          <TableCell sx={{ color: "gray" }}>
                            {getDate(order?.createdAt)}
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
                              onClick={() => onDelete(order._id)}
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
            </Grid>
          </Grid>
        )}
      </Container>
    </DefaultLayout>
  );
};

export default Profile;
