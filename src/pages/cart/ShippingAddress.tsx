import React, { useEffect, useState } from "react";
import { Button, Grid, TextField, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAppDispatch, useAppSelector } from "../../redux";
import { saveAddress } from "../../redux/cart/cart-slice";
import { Country, City } from "country-state-city";
import FormContainer from "../../components/UI/form-container";
import { AddressTypes } from "../../types/user";

const ShippingAddressPage = () => {
  const { shippingAddress } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AddressTypes>({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      saveAddress({
        address: formData.address,
        city: selectedCity ? selectedCity.label : formData.city,
        postalCode: formData.postalCode,
        country: selectedCountry ? selectedCountry.label : formData.country,
      })
    );
    navigate("/place-order");
  };

  useEffect(() => {
    if (shippingAddress) navigate("/place-order");
  }, [shippingAddress, navigate]);

  const handleCountryChange = (selectedOption: any) => {
    setSelectedCountry(selectedOption);
    setSelectedCity(null); // reset city selection
  };

  const handleCityChange = (selectedOption: any) => {
    setSelectedCity(selectedOption);
  };

  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const cityOptions = selectedCountry
    ? City.getCitiesOfCountry(selectedCountry.value)?.map((city) => ({
        value: city.name,
        label: city.name,
      })) || []
    : [];

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: "56px",
      zIndex: 1,
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <FormContainer meta="Shipping Address" title="Shipping Address">
      <form onSubmit={onSubmit}>
        <Grid container spacing={3} sx={{ mt: 2, mb: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              variant="outlined"
              fullWidth
              required
              value={formData.address}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ position: "relative" }}>
              <Select
                options={countryOptions}
                value={selectedCountry}
                onChange={handleCountryChange}
                placeholder="Select Country"
                styles={customStyles}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ position: "relative" }}>
              <Select
                options={cityOptions}
                value={selectedCity}
                onChange={handleCityChange}
                placeholder="Select City"
                isDisabled={!selectedCountry}
                styles={customStyles}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Postal Code"
              name="postalCode"
              variant="outlined"
              fullWidth
              required
              value={formData.postalCode}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ backgroundColor: "#e03a3c" }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormContainer>
  );
};

export default ShippingAddressPage;
