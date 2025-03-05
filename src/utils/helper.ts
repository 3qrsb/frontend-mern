import { ShippingAddress } from "../types/order";

export const getDate = (date: Date): string => {
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(date);
};

export const formatShippingAddress = (address: ShippingAddress): string => {
  if (!address) return "";
  const { street, apartment, city, state, country, postalCode } = address;
  return `${street}${apartment ? `, ${apartment}` : ""}, ${city}${
    state ? `, ${state}` : ""
  }, ${country} ${postalCode}`;
};

export const baseUrl = import.meta.env.VITE_API_URL;
