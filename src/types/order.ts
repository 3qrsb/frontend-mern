import { Product } from "./product";

export interface ShippingAddress {
  street: string;
  apartment?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
}

export interface Ordertypes {
  _id: string;
  user: string;
  shippingAddress: ShippingAddress;
  cartItems: Product[];
  discountAmount: number;
  totalPrice: number;
  isPaid: boolean;
  createdAt: Date;
  status?: string;
}
