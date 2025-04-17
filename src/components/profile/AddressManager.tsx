import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import toast from "react-hot-toast";
import authAxios from "../../utils/auth-axios";
import { setError } from "../../utils/error";
import { AddressTypes } from "../../types/user";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addressSchema,
  AddressFormValues,
} from "../../validation/addressValidation";

interface AddressManagerProps {
  userId: string;
}

const AddressManager: React.FC<AddressManagerProps> = ({ userId }) => {
  const [addresses, setAddresses] = useState<AddressTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [editAddressId, setEditAddressId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: yupResolver(addressSchema),
    mode: "onChange",
    defaultValues: {
      street: "",
      apartment: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const { data } = await authAxios.get<AddressTypes[]>(
        `/users/${userId}/addresses`
      );
      setAddresses(data);
    } catch (err: any) {
      toast.error(setError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const onSubmit = async (vals: AddressFormValues) => {
    try {
      let updated: AddressTypes[];
      if (editAddressId) {
        const { data } = await authAxios.put<AddressTypes[]>(
          `/users/${userId}/addresses/${editAddressId}`,
          vals
        );
        updated = data;
        toast.success("Address updated!");
      } else {
        const { data } = await authAxios.post<AddressTypes[]>(
          `/users/${userId}/addresses`,
          vals
        );
        updated = data;
        toast.success("Address added!");
      }

      setAddresses(updated);
      reset();
      setEditAddressId(null);
    } catch (err: any) {
      toast.error(setError(err));
    }
  };

  const handleEdit = (addr: AddressTypes) => {
    setEditAddressId(addr._id!);
    reset({
      street: addr.street,
      apartment: addr.apartment || "",
      city: addr.city,
      state: addr.state || "",
      country: addr.country,
      postalCode: addr.postalCode,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      const { data } = await authAxios.delete<AddressTypes[]>(
        `/users/${userId}/addresses/${id}`
      );
      toast.success("Deleted!");
      setAddresses(data);
    } catch (err: any) {
      toast.error(setError(err));
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Your Addresses
      </Typography>

      {loading ? (
        <Typography>Loading…</Typography>
      ) : addresses.length === 0 ? (
        <Typography>No saved addresses.</Typography>
      ) : (
        <Grid container spacing={2} mb={2}>
          {addresses.map((addr) => (
            <Grid key={addr._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card elevation={3}>
                <CardContent>
                  <Typography fontWeight="bold">
                    {addr.street}
                    {addr.apartment && `, ${addr.apartment}`}
                  </Typography>
                  <Typography color="text.secondary">
                    {addr.city}
                    {addr.state && `, ${addr.state}`}
                  </Typography>
                  <Typography>
                    {addr.country}, {addr.postalCode}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleEdit(addr)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(addr._id!)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          mt: 3,
          maxWidth: 600,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        }}
      >
        {[
          { name: "street", label: "Street", required: true },
          { name: "apartment", label: "Apartment (optional)" },
          { name: "city", label: "City", required: true },
          { name: "state", label: "State (optional)" },
          { name: "country", label: "Country", required: true },
          { name: "postalCode", label: "Postal Code", required: true },
        ].map(({ name, label, required }) => (
          <Controller
            key={name}
            name={name as keyof AddressFormValues}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={label}
                fullWidth
                required={!!required}
                error={!!errors[name as keyof AddressFormValues]}
                helperText={errors[name as keyof AddressFormValues]?.message}
              />
            )}
          />
        ))}

        <Box sx={{ gridColumn: "1/-1", mt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={!isDirty || !isValid || isSubmitting}
          >
            {editAddressId ? "Update Address" : "Add Address"}
          </Button>
          {editAddressId && (
            <Button
              variant="outlined"
              onClick={() => {
                reset();
                setEditAddressId(null);
              }}
              sx={{ ml: 2 }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AddressManager;
