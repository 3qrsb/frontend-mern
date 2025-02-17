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
import { AddressTypes } from "../../types/user";
import authAxios from "../../utils/auth-axios";
import { setError } from "../../utils/error";

interface AddressSelectorModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onAddressSelected: (address: AddressTypes) => void;
}

const AddressSelectorModal: React.FC<AddressSelectorModalProps> = ({
  open,
  onClose,
  userId,
  onAddressSelected,
}) => {
  const [addresses, setAddresses] = useState<AddressTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState<AddressTypes>({
    street: "",
    apartment: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const { data } = await authAxios.get(`/users/${userId}/addresses`);
      setAddresses(data);
    } catch (error: any) {
      toast.error(setError(error));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchAddresses();
    }
  }, [open, userId]);

  const handleSelectAddress = (address: AddressTypes) => {
    onAddressSelected(address);
    onClose();
  };

  const handleAddAddress = async () => {
    try {
      const { data } = await authAxios.post(
        `/users/${userId}/addresses`,
        newAddress
      );
      toast.success("Address added successfully!");
      setAddresses(data);
      setIsAdding(false);
      setNewAddress({
        street: "",
        apartment: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      });
    } catch (error: any) {
      toast.error(setError(error));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Select Shipping Address
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Typography>Loading addresses...</Typography>
        ) : (
          <Box>
            {addresses.length > 0 ? (
              addresses.map((addr, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid",
                    borderColor: "grey.300",
                    borderRadius: 1,
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    "&:hover": { backgroundColor: "grey.100" },
                  }}
                  onClick={() => handleSelectAddress(addr)}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {addr.street}
                    {addr.apartment ? `, ${addr.apartment}` : ""}
                  </Typography>
                  <Typography variant="body2">
                    {addr.city}
                    {addr.state ? `, ${addr.state}` : ""}
                  </Typography>
                  <Typography variant="body2">
                    {addr.country}, {addr.postalCode}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>
                No addresses found. Please add a new address.
              </Typography>
            )}
          </Box>
        )}

        {isAdding && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Add New Address
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Street"
                  fullWidth
                  required
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Apartment (optional)"
                  fullWidth
                  value={newAddress.apartment}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, apartment: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="City"
                  fullWidth
                  required
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="State (optional)"
                  fullWidth
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Country"
                  fullWidth
                  required
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Postal Code"
                  fullWidth
                  required
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, postalCode: e.target.value })
                  }
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button variant="outlined" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddAddress}>
                Save
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} color="primary">
            Add New Address
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressSelectorModal;
