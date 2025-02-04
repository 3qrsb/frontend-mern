import { Product } from "./product";

export interface Ordertypes {
  _id: string;
  user: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  cartItems: Product[];
  discountAmount: number;
  totalPrice: number;
  isPaid: boolean;
  createdAt: Date;
}
