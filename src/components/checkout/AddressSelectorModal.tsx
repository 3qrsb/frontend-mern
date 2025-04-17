import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
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

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  onAddressSelected: (address: AddressTypes) => void;
}

const AddressSelectorModal: React.FC<Props> = ({
  open,
  onClose,
  userId,
  onAddressSelected,
}) => {
  const [addresses, setAddresses] = useState<AddressTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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
    if (open) fetchAddresses();
  }, [open, userId]);

  const onSelect = (addr: AddressTypes) => {
    onAddressSelected(addr);
    onClose();
  };

  const onAdd = async (vals: AddressFormValues) => {
    try {
      const { data } = await authAxios.post<AddressTypes[]>(
        `/users/${userId}/addresses`,
        vals
      );
      toast.success("Address added!");
      setAddresses(data);
      reset();
      setIsAdding(false);
    } catch (err: any) {
      toast.error(setError(err));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Shipping Address</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Typography>Loading…</Typography>
        ) : addresses.length > 0 ? (
          addresses.map((addr) => (
            <Box
              key={addr._id}
              onClick={() => onSelect(addr)}
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 1,
                cursor: "pointer",
                "&:hover": { backgroundColor: "grey.100" },
              }}
            >
              <Typography fontWeight="bold">
                {addr.street}
                {addr.apartment && `, ${addr.apartment}`}
              </Typography>
              <Typography>
                {addr.city}
                {addr.state && `, ${addr.state}`}
              </Typography>
              <Typography>
                {addr.country}, {addr.postalCode}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>No addresses found.</Typography>
        )}

        {isAdding && (
          <Box component="form" onSubmit={handleSubmit(onAdd)} sx={{ mt: 3 }}>
            <Typography gutterBottom>Add New Address</Typography>
            <Grid container spacing={2}>
              {[
                { name: "street", label: "Street", xs: 12 },
                { name: "apartment", label: "Apartment", xs: 12 },
                { name: "city", label: "City", xs: 6 },
                { name: "state", label: "State (optional)", xs: 6 },
                { name: "country", label: "Country", xs: 6 },
                { name: "postalCode", label: "Postal Code", xs: 6 },
              ].map(({ name, label, xs }) => (
                <Grid key={name} size={{ xs }}>
                  <Controller
                    name={name as keyof AddressFormValues}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={label}
                        fullWidth
                        required={[
                          "street",
                          "city",
                          "country",
                          "postalCode",
                        ].includes(name)}
                        error={!!errors[name as keyof AddressFormValues]}
                        helperText={
                          errors[name as keyof AddressFormValues]?.message
                        }
                      />
                    )}
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 2, textAlign: "right" }}>
              <Button
                onClick={() => {
                  reset();
                  setIsAdding(false);
                }}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!isDirty || !isValid || isSubmitting}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between" }}>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>Add New Address</Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressSelectorModal;
