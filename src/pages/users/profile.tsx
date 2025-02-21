import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "../../components/layouts/default/DefaultLayout";
import Loader from "../../components/UI/loader";
import { useAppDispatch, useAppSelector } from "../../redux";
import { getUserBydId } from "../../redux/users/user-details";
import { getUserOrder } from "../../redux/orders/user-orders";
import authAxios from "../../utils/auth-axios";
import { setError } from "../../utils/error";
import toast from "react-hot-toast";
import {
  Container,
  Button,
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import UserOrdersTable from "../../components/profile/UserOrdersTable";
import AddressManager from "../../components/profile/AddressManager";

type FormValues = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
};

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const { user, loading } = useAppSelector((state) => state.userDetails);
  const { orders, loading: orderLoading } = useAppSelector(
    (state) => state.userOrder
  );

  const [refresh, setRefresh] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState(0);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required").email("Invalid email"),
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
      .then(() => {
        toast.success("User has been updated!");
        setRefresh((prev) => !prev);
      })
      .catch((err) => toast.error(setError(err)));
  };

  const onDeleteOrder = (orderId: string) => {
    if (window.confirm("It will delete this order from your account!")) {
      authAxios
        .delete(`/orders/${orderId}`)
        .then((res) => {
          toast.success(res.data);
          setRefresh((prev) => !prev);
        })
        .catch((e) => toast.error(setError(e)));
    }
  };

  useEffect(() => {
    dispatch(getUserBydId(id));
    dispatch(getUserOrder());
  }, [dispatch, id, refresh]);

  if (loading || !user || orderLoading) {
    return (
      <DefaultLayout title="Profile">
        <Loader />
      </DefaultLayout>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <DefaultLayout title={`${user?.name} profile`}>
      <Container sx={{ py: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Tabs
              orientation="vertical"
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderRight: 1, borderColor: "divider" }}
            >
              <Tab label="Profile" />
              <Tab label="Addresses" />
              <Tab label="Orders" />
            </Tabs>
          </Grid>

          <Grid size={{ xs: 12, md: 9 }}>
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Profile Details
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{ maxWidth: 400 }}
                >
                  <TextField
                    fullWidth
                    label="Username"
                    defaultValue={user.name}
                    {...register("name")}
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    defaultValue={user.email}
                    {...register("email")}
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
                    sx={{ mt: 2 }}
                  >
                    Update
                  </Button>
                </Box>
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Manage Addresses
                </Typography>
                <AddressManager userId={user._id} />
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Your Orders
                </Typography>
                <UserOrdersTable orders={orders} onDelete={onDeleteOrder} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </DefaultLayout>
  );
};

export default ProfilePage;
