import { Product } from "./product";
import { User } from "./user";

export interface ShippingAddress {
  street: string;
  apartment?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
}

export interface Order {
  _id: string;
  user: string | User;
  shippingAddress: ShippingAddress;
  cartItems: Product[];
  discountAmount: number;
  totalPrice: number;
  isPaid: boolean;
  createdAt: Date;
  status?: string;
}
