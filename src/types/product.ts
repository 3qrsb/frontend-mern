export interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  description: string;
  qty: number;
  availableQty: number;
  createdAt: Date;
  updatedAt: Date;
  reviews: { rating: number }[];
  totalSales: number;
  inStock: boolean;
  user:
    | string
    | {
        _id: string;
        name: string;
        isAdmin: boolean;
        isSeller: boolean;
      };
}
