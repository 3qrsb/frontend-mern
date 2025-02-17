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
import authAxios from "../../utils/auth-axios";
import toast from "react-hot-toast";
import { setError } from "../../utils/error";
import { AddressTypes } from "../../types/user";

interface AddressManagerProps {
  userId: string;
}

const AddressManager: React.FC<AddressManagerProps> = ({ userId }) => {
  const [addresses, setAddresses] = useState<AddressTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [editAddressId, setEditAddressId] = useState<string | null>(null);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const { data } = await authAxios.get(`/users/${userId}/addresses`);
      setAddresses(data);
      setLoading(false);
    } catch (error: any) {
      toast.error(setError(error));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const handleAddOrUpdateAddress = async () => {
    try {
      const addressPayload = {
        street,
        apartment,
        city,
        state: stateField,
        country,
        postalCode,
      };
      let response;
      if (editAddressId) {
        response = await authAxios.put(
          `/users/${userId}/addresses/${editAddressId}`,
          addressPayload
        );
        toast.success("Address updated successfully!");
      } else {
        response = await authAxios.post(
          `/users/${userId}/addresses`,
          addressPayload
        );
        toast.success("Address added successfully!");
      }
      setAddresses(response.data);
      setStreet("");
      setApartment("");
      setCity("");
      setStateField("");
      setCountry("");
      setPostalCode("");
      setEditAddressId(null);
    } catch (error: any) {
      toast.error(setError(error));
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm("Do you want to delete this address?")) {
      try {
        const { data } = await authAxios.delete(
          `/users/${userId}/addresses/${addressId}`
        );
        toast.success("Address deleted!");
        setAddresses(data);
      } catch (error: any) {
        toast.error(setError(error));
      }
    }
  };

  const handleEditAddress = (addr: AddressTypes) => {
    setEditAddressId(addr._id || null);
    setStreet(addr.street);
    setApartment(addr.apartment || "");
    setCity(addr.city);
    setStateField(addr.state || "");
    setCountry(addr.country);
    setPostalCode(addr.postalCode);
  };

  const handleCancelEdit = () => {
    setEditAddressId(null);
    setStreet("");
    setApartment("");
    setCity("");
    setStateField("");
    setCountry("");
    setPostalCode("");
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Your Addresses
      </Typography>

      {/* Existing Addresses */}
      {loading ? (
        <Typography variant="body1">Loading addresses...</Typography>
      ) : addresses.length === 0 ? (
        <Typography variant="body1">
          You have no saved addresses yet.
        </Typography>
      ) : (
        <Grid container spacing={2} mb={2}>
          {addresses.map((addr) => (
            <Grid key={addr._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {addr.street}
                    {addr.apartment && `, ${addr.apartment}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {addr.city}
                    {addr.state && `, ${addr.state}`}
                  </Typography>
                  <Typography variant="body2">
                    {addr.country}, {addr.postalCode}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleEditAddress(addr)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteAddress(addr._id!)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Address Form */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {editAddressId ? "Edit Address" : "Add a New Address"}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            maxWidth: 600,
          }}
        >
          <TextField
            label="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Apartment (optional)"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            fullWidth
          />
          <TextField
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="State (optional)"
            value={stateField}
            onChange={(e) => setStateField(e.target.value)}
            fullWidth
          />
          <TextField
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            fullWidth
            required
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleAddOrUpdateAddress}>
            {editAddressId ? "Update Address" : "Add Address"}
          </Button>
          {editAddressId && (
            <Button
              variant="outlined"
              onClick={handleCancelEdit}
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
