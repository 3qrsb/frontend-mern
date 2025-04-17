import * as Yup from "yup";

const postalCodeRegex = /^\d{6}$/;
const nameRegex = /^[\p{L} .'-]+$/u;

export const addressSchema = Yup.object({
  street: Yup.string().required("Street is required"),

  apartment: Yup.string(),

  city: Yup.string()
    .required("City is required")
    .matches(
      nameRegex,
      "City may only contain letters, spaces, '.' , '-' or '''"
    ),

  state: Yup.string(),

  country: Yup.string()
    .required("Country is required")
    .matches(
      nameRegex,
      "Country may only contain letters, spaces, '.' , '-' or '''"
    ),

  postalCode: Yup.string()
    .required("Postal code is required")
    .matches(postalCodeRegex, "Postal code must be exactly 6 digits"),
});

export type AddressFormValues = Yup.InferType<typeof addressSchema>;
